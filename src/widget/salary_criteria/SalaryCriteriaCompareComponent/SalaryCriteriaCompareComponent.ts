import {
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SalaryCriteriaFullData,
    SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    CompareComponent,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SalaryCriteriaRuleCompareValue,
} from '@/widget/salary_criteria/SalaryCriteriaRuleCompareValue/SalaryCriteriaRuleCompareValue.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import {
    SalaryCriteriaValidator,
} from '@/widget/salary_criteria/validators/SalaryCriteriaValidator.ts';
import {
    CompareType,
    ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
import {
    SALARY_CRITERIA_HEADER_TYPE,
} from '@/widget/salary_criteria/salary-criteria.header-type.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    GoodCategoryCompareComponent,
} from '@/widget/goods/list/GoodCategoryCompareComponent/GoodCategoryCompareComponent.ts';
import {
    getOnlyContextGoodCopyData,
} from '@/widget/salary_criteria/SalaryCriteriaCompareComponent/lib/getOnlyContextGoodCopyData.ts';
import {
    GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export type SalaryCriteriaTitlesTree = {
    title: string;
    items: Array<SalaryCriteriaTitlesTree>;
}

export type SalaryCriteriaChildrenItem<Type> = {
    component: ICompareEntity<Type>;
    titlesTree: SalaryCriteriaTitlesTree;
}


export type SalaryCriteriaCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetCriteria: SalaryCriteriaFullData;
        targetCopyData: SalaryCriteriaListDataForCopy;
        clientCopyData: SalaryCriteriaListDataForCopy;
        clientId: string;
        bearer: string;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class SalaryCriteriaCompareComponent extends CompareComponent<SalaryCriteriaFullData> {
    private readonly _targetCriteria: SalaryCriteriaFullData;
    private readonly _targetCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientCriteria?: SalaryCriteriaFullData;
    private _ruleCategories: Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>>                            = [];
    //private _servicesCompareComponents: Array<SalaryCriteriaChildrenItem<SettingsServiceCategoryDataWithChildren>>     = [];
    //private _serviceItemsCompareComponents: Array<SalaryCriteriaChildrenItem<SettingsServiceCategoryDataWithChildren>> = [];
    //private _goodsCompareComponents: Array<SalaryCriteriaChildrenItem<GoodsCategoryTreeFullData>>                      = [];
    //private _goodItemsCompareComponents: Array<SalaryCriteriaChildrenItem<GoodsCategoryTreeFullData>>                  = [];

    constructor (props: SalaryCriteriaCompareComponentProps) {
        const {
                  targetCriteria,
                  clientCopyData,
                  clientId,
                  bearer,
                  targetCopyData,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._targetCriteria = { ...targetCriteria };
        this._targetCopyData = targetCopyData;
        this._clientCopyData = clientCopyData;
        this._clientId       = clientId;
        this._bearer         = bearer;
        this._logger         = logger;
        this._fetcher        = fetcher;
        this._clientCriteria = this._clientCopyData.criteriaList.find((criteria) => criteria.title === this._targetCriteria.title);

        this._render();
    }

    public getChildren (): Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>> {
        return this._ruleCategories;
    }

    protected async _action (): Promise<SalaryCriteriaFullData | null> {
        if (this._clientCriteria) {
            if (this._itemIsValid()) {
                if (this._childrenIsValid()) {
                    // return item
                    return this._clientCriteria;
                } else {
                    // action children
                    // return item
                }
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    // return item
                } else {
                    // update item
                    // action children
                    // return item
                }
            }

            // TEMP: Чтобы не было ошибки типизации
            return null;
        } else {
            if (!this._isNoCreateNew()) {
                // create item

                if (!this._childrenIsValid()) {
                    // action children
                }

                // return item
            }

            return null;
        }
    }

    protected _render (): void {
        this._beforeRender();

        this._compareChildren = [];
        this._ruleCategories  = [];
        this._compareRows     = [
            new CompareBox({
                title     : 'Информация',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetCriteria.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCriteria?.id,
                        }),
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Период',
                        targetValue: new CompareSelectValue({
                            defaultValue    : 0,
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : [
                                {
                                    value   : 0,
                                    label   : Converter.period(0),
                                    selected: Number(this._targetCriteria.period) === 0,
                                },
                                {
                                    value   : 1,
                                    label   : Converter.period(1),
                                    selected: Number(this._targetCriteria.period) === 1,
                                },
                            ],
                        }),
                        clientValue: new CompareTextValue({
                            value: Number(this._clientCriteria?.period),
                            label: Converter.period(Number(this._clientCriteria?.period)),
                        }),
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Условия',
                level     : 2,
                components: this._targetCriteria.rules?.map((rule, index) => {
                    // Categories
                    const categories        = rule.context.services?.categories.map((ruleCategory) => (
                        new SettingsServiceCategoryCompareComponent({
                            targetCategory : this._targetCopyData.settingsCopyData.tree.find((category) => category.id.toString() === ruleCategory.categoryId.toString())!,
                            targetResources: this._targetCopyData.settingsCopyData.resources,
                            clientId       : this._clientId,
                            bearer         : this._bearer,
                            clientData     : this._clientCopyData.settingsCopyData,
                            parent         : this,
                            logger         : this._logger,
                            fetcher        : this._fetcher,
                        })
                    )) ?? [];
                    const concatenatedItems = rule.context.services?.items.reduce((acc, item) => {
                        if (acc[item.categoryId]) {
                            acc[item.categoryId].push(item.itemId.toString());
                        } else {
                            acc[item.categoryId] = [ item.itemId.toString() ];
                        }
                        return acc;
                    }, {} as Record<string, Array<string>>) ?? {};
                    const categoriesItems   = Object.entries(concatenatedItems)
                        .map(([ categoryId, itemsIds ]) => {
                            const category = this._targetCopyData.settingsCopyData.tree.find((category) => category.id.toString() === categoryId);

                            if (category) {
                                category.children = category.children.filter((child) => itemsIds.includes(child.id.toString()));

                                return new SettingsServiceCategoryCompareComponent({
                                    targetCategory : category,
                                    targetResources: this._targetCopyData.settingsCopyData.resources,
                                    clientData     : this._clientCopyData.settingsCopyData,
                                    clientId       : this._clientId,
                                    bearer         : this._bearer,
                                    parent         : this,
                                    logger         : this._logger,
                                    fetcher        : this._fetcher,
                                });
                            }
                            return null;
                        })
                        .filter((item) => item !== null);

                    // Goods
                    const goodsCategoriesIds: Array<string> = [];
                    const goodsItemsIds: Array<string>      = [];

                    rule.context.goods?.categories.forEach((category) => goodsCategoriesIds.push(category.categoryId));
                    rule.context.goods?.items.forEach((item) => {
                        goodsItemsIds.push(item.categoryId);
                        goodsItemsIds.push(item.itemId);
                    });

                    const goods                  = rule.context.goods?.categories
                        .map((ruleGoodCategory) => {
                            const category = this._targetCopyData.goodsCopyData.categories.list.find((category) => category.id.toString() === ruleGoodCategory.categoryId.toString());

                            if (category) {
                                const categoryGoodsIds                                    = category.goods.map((good) => good.id);
                                let parentCategory: GoodsCategoryTreeFullData | undefined = category;
                                const path: Array<string>                                 = [ category.id ];
                                while (parentCategory?.parent?.id !== undefined && parentCategory?.parent?.id !== '0') {
                                    path.push(parentCategory.parent.id);
                                    parentCategory = this._targetCopyData.goodsCopyData.categories.list.find((category) => category.id.toString() === parentCategory?.parent?.id);
                                }

                                if (parentCategory) {
                                    return new GoodCategoryCompareComponent({
                                        targetCategory  : getOnlyContextGoodCopyData(parentCategory, path, categoryGoodsIds),
                                        clientCategories: this._clientCopyData.goodsCopyData.categories.list,
                                        bearer          : this._bearer,
                                        clientId        : this._clientId,
                                        logger          : this._logger,
                                        fetcher         : this._fetcher,
                                    });
                                }
                            }

                            return null;
                        })
                        .filter((item) => item !== null) ?? [];
                    const concatenatedGoodsItems = rule.context.goods?.items.reduce((acc, item) => {
                        if (acc[item.categoryId]) {
                            acc[item.categoryId].push(item.itemId.toString());
                        } else {
                            acc[item.categoryId] = [ item.itemId.toString() ];
                        }
                        return acc;
                    }, {} as Record<string, Array<string>>) ?? {};

                    const goodsItems = Object.keys(concatenatedGoodsItems)
                        .map((categoryId) => {
                            const category = this._targetCopyData.goodsCopyData.categories.list.find((category) => category.id.toString() === categoryId);

                            if (category) {
                                let parentCategory: GoodsCategoryTreeFullData | undefined = category;
                                const path: Array<string>                                 = [ category.id ];
                                while (parentCategory?.parent?.id !== undefined && parentCategory?.parent?.id !== '0') {
                                    path.push(parentCategory.parent.id);
                                    parentCategory = this._targetCopyData.goodsCopyData.categories.list.find((category) => category.id.toString() === parentCategory?.parent?.id);
                                }

                                if (parentCategory) {
                                    return new GoodCategoryCompareComponent({
                                        targetCategory  : getOnlyContextGoodCopyData(parentCategory, path, goodsItemsIds),
                                        clientCategories: this._clientCopyData.goodsCopyData.categories.list,
                                        bearer          : this._bearer,
                                        clientId        : this._clientId,
                                        logger          : this._logger,
                                        fetcher         : this._fetcher,
                                    });
                                }
                            }

                            return null;
                        })
                        .filter((item) => item !== null);

                    const childrenCategories = new CompareBox({
                        level     : 4,
                        title     : 'Категории услуг целиком',
                        components: categories,
                    });

                    const childrenCategoriesItems = new CompareBox({
                        level     : 4,
                        title     : 'Категории услуг частично',
                        components: categoriesItems,
                    });

                    const goodsCategories = new CompareBox({
                        level     : 4,
                        title     : 'Категории товаров целиком',
                        components: goods,
                    });

                    const goodsPartOfItems = new CompareBox({
                        level     : 4,
                        title     : 'Категории товаров частично',
                        components: goodsItems,
                    });

                    this._ruleCategories = this._ruleCategories.concat(categories);
                    this._compareChildren.push(childrenCategories);
                    this._compareChildren.push(childrenCategoriesItems);
                    this._compareChildren.push(goodsCategories);
                    this._compareChildren.push(goodsPartOfItems);

                    return [
                        new CompareRow({
                            label            : `Правило ${ index + 1 }`,
                            targetValue      : new SalaryCriteriaRuleCompareValue({
                                value   : rule,
                                editable: true,
                            }),
                            clientValue      : new SalaryCriteriaRuleCompareValue({
                                value   : this._clientCriteria?.rules[index],
                                editable: false,
                            }),
                            validationMethod : SalaryCriteriaValidator.rules(categories),
                            parent           : this,
                            revalidateOnCheck: true,
                        }),
                        childrenCategories,
                        childrenCategoriesItems,
                        goodsCategories,
                        goodsPartOfItems,
                    ];
                }).flat(),
            }),
        ];
        this._header          = new CompareHeader({
            label                 : 'Критерий расчета ЗП',
            targetHeaderData      : this._targetCriteria.title,
            clientHeaderData      : this._clientCriteria?.title,
            variants              : this._clientCopyData.criteriaList.map((criteria) => ({
                label   : criteria.title,
                value   : criteria.id,
                selected: criteria.id === this._clientCriteria?.id,
            })),
            onVariantChange       : (variant) => {
                this._clientCriteria = this._clientCopyData.criteriaList.find((category) => category.id.toString() === variant.value);
                this._render();
            },
            onRename              : (title: string) => {
                this._targetCriteria.title = title;
            },
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
            rows                  : this._compareRows,
            parent                : this,
            type                  : SALARY_CRITERIA_HEADER_TYPE,
            compareType           : this._compareType,
        });

        this._beforeEndRender(this._clientCriteria);
    }
}