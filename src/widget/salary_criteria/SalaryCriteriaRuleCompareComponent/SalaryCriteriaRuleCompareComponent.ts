import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    SalaryCriteriaListDataForCopy,
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import {
    GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import {
    GoodCategoryCompareComponent,
} from '@/widget/goods/list/GoodCategoryCompareComponent/GoodCategoryCompareComponent.ts';
import {
    getOnlyContextGoodCopyData,
} from '@/widget/salary_criteria/SalaryCriteriaCompareComponent/lib/getOnlyContextGoodCopyData.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    SalaryCriteriaRuleCompareValue,
} from '@/widget/salary_criteria/SalaryCriteriaRuleCompareValue/SalaryCriteriaRuleCompareValue.ts';
import {
    SalaryCriteriaValidator,
} from '@/widget/salary_criteria/validators/SalaryCriteriaValidator.ts';
import {
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    SALARY_CRITERIA_RULE_HEADER_TYPE,
} from '@/widget/salary_criteria/salary-criteria.header-type.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getSalaryContextByChildren,
} from '@/action/salary_criteria/convert/getSalaryContextByChildren.ts';


export type SalaryCriteriaRuleCompareComponentProps =
    CompareComponentProps
    & {
        bearer: string;
        clientId: string;
        ruleIndex: number;
        clientRule?: SalaryCriteriaRuleData | null;
        targetRule?: SalaryCriteriaRuleData | null;
        targetCopyData: SalaryCriteriaListDataForCopy;
        clientCopyData: SalaryCriteriaListDataForCopy;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class SalaryCriteriaRuleCompareComponent extends CompareComponent<SalaryCriteriaRuleData> {
    private readonly _clientRule?: SalaryCriteriaRuleData | null;
    private readonly _targetRule?: SalaryCriteriaRuleData | null;
    private readonly _targetCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _ruleIndex: number;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;

    private _ruleCategories: Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>>     = [];
    private _ruleCategoriesPart: Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>> = [];
    private _ruleGoods: Array<ICompareEntity<GoodsCategoryTreeFullData>>                        = [];
    private _ruleGoodsPart: Array<ICompareEntity<GoodsCategoryTreeFullData>>                    = [];

    constructor (props: SalaryCriteriaRuleCompareComponentProps) {
        const {
                  clientId,
                  bearer,
                  targetRule,
                  clientRule,
                  logger,
                  fetcher,
                  targetCopyData,
                  clientCopyData,
                  ruleIndex,
              } = props;
        super(props);

        this._targetRule     = targetRule;
        this._clientRule     = clientRule;
        this._targetCopyData = targetCopyData;
        this._clientCopyData = clientCopyData;
        this._bearer         = bearer;
        this._clientId       = clientId;
        this._fetcher        = fetcher;
        this._logger         = logger;
        this._ruleIndex      = ruleIndex;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return [
            ...this._ruleCategories,
            ...this._ruleCategoriesPart,
            ...this._ruleGoods,
            ...this._ruleGoodsPart,
        ];
    }

    protected async _action (): Promise<SalaryCriteriaRuleData | null> {
        const splitter                = new PromiseSplitter(5, 1);
        const serviceCategories       = await splitter.exec<SettingsServiceCategoryDataWithChildren | null>(
            this._ruleCategories.map((category) => ({ chain: [ category.getAction() ] })),
        );
        const partOfServiceCategories = await splitter.exec<SettingsServiceCategoryDataWithChildren | null>(
            this._ruleCategoriesPart.map((category) => ({ chain: [ category.getAction() ] })),
        );
        const goodsCategories         = await splitter.exec<GoodsCategoryTreeFullData | null>(
            this._ruleGoods.map((category) => ({ chain: [ category.getAction() ] })),
        );
        const partOfGoodsCategories   = await splitter.exec<GoodsCategoryTreeFullData | null>(
            this._ruleGoodsPart.map((category) => ({ chain: [ category.getAction() ] })),
        );

        return {
            ...this._targetRule!,
            id     : this._clientRule?.id ?? '',
            context: getSalaryContextByChildren({
                serviceCategoryList      : serviceCategories.filter((category) => category !== null),
                partOfServiceCategoryList: partOfServiceCategories.filter((category) => category !== null),
                goodsCategoryList        : goodsCategories.filter((category) => category !== null),
                partOfGoodsCategoryList  : partOfGoodsCategories.filter((category) => category !== null),
            }),
        };
    }

    protected _render (): void {
        this._beforeRender();

        const categories        = this._targetRule?.context.services?.categories.map((ruleCategory) => (
            new SettingsServiceCategoryCompareComponent({
                targetCategory : this._targetCopyData.settingsCopyData.tree.find((category) => category.id.toString() === ruleCategory.category.toString())!,
                targetResources: this._targetCopyData.settingsCopyData.resources,
                clientId       : this._clientId,
                bearer         : this._bearer,
                clientData     : this._clientCopyData.settingsCopyData,
                parent         : this,
                logger         : this._logger,
                fetcher        : this._fetcher,
            })
        )) ?? [];
        const concatenatedItems = this._targetRule?.context.services?.items.reduce((acc, item) => {
            if (acc[item.category]) {
                acc[item.category].push(item.item.toString());
            } else {
                acc[item.category] = [ item.item.toString() ];
            }
            return acc;
        }, {} as Record<string, Array<string>>) ?? {};

        const categoriesItems = Object.entries(concatenatedItems)
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
                        splitterLimit  : 2,
                        splitterRetry  : 3,
                    });
                }
                return null;
            })
            .filter((item) => item !== null);

        // Goods
        const goodsCategoriesIds: Array<string> = [];
        const goodsItemsIds: Array<string>      = [];

        this._targetRule?.context.goods?.categories.forEach((category) => goodsCategoriesIds.push(category.category));
        this._targetRule?.context.goods?.items.forEach((item) => {
            goodsItemsIds.push(item.category);
            goodsItemsIds.push(item.item);
        });

        const goods                  = this._targetRule?.context.goods?.categories
            .map((ruleGoodCategory) => {
                const category = this._targetCopyData.goodsCopyData.categories.list.find((category) => category.id.toString() === ruleGoodCategory.category.toString());

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
                            parent          : this,
                        });
                    }
                }

                return null;
            })
            .filter((item) => item !== null) ?? [];
        const concatenatedGoodsItems = this._targetRule?.context.goods?.items.reduce((acc, item) => {
            if (acc[item.category]) {
                acc[item.category].push(item.item.toString());
            } else {
                acc[item.category] = [ item.item.toString() ];
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
                            parent          : this,
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

        this._ruleCategories.push(...categories);
        this._ruleCategoriesPart.push(...categoriesItems);
        this._ruleGoods.push(...goods);
        this._ruleGoodsPart.push(...goodsItems);

        this._compareChildren.push(childrenCategories);
        this._compareChildren.push(childrenCategoriesItems);
        this._compareChildren.push(goodsCategories);
        this._compareChildren.push(goodsPartOfItems);

        this._compareRows = [
            new CompareRow({
                label            : `Правило ${ this._ruleIndex + 1 }`,
                targetValue      : new SalaryCriteriaRuleCompareValue({
                    value   : this._targetRule ?? undefined,
                    editable: true,
                }),
                clientValue      : new SalaryCriteriaRuleCompareValue({
                    value   : this._clientRule ?? undefined,
                    editable: false,
                }),
                validationMethod : SalaryCriteriaValidator.rules([], false),
                parent           : this,
                revalidateOnCheck: true,
            }),
        ];

        this._header = new CompareHeader({
            label           : `Правило ${ this._ruleIndex + 1 }`,
            targetHeaderData: `-`,
            clientHeaderData: `-`,
            disable         : true,
            variants        : [],
            onVariantChange : () => {
            },
            onRename        : () => {
            },
            rows            : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            type            : SALARY_CRITERIA_RULE_HEADER_TYPE,
            compareType     : this._compareType,
        });

        this._beforeEndRender(this._clientRule);
    }
}