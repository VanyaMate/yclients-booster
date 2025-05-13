import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import { GOOD_CATEGORY_HEADER_TYPE } from '@/widget/header-types.ts';
import {
    CompareBoxWithoutValidation,
} from '@/entity/compare/CompareWithoutValidation/CompareBoxWithoutValidation.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    GoodCategoryDropdownActions,
} from '@/widget/goods/list/GoodCategoryDropdownActions/GoodCategoryDropdownActions.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    updateGoodCategoryRequestAction,
} from '@/action/goods/list/request-actions/updateGoodCategory.request-action.ts';
import {
    createGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/createGoodsCategory.request-action.ts';
import {
    getGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategory.request-action.ts';
import {
    GoodCompareComponent,
} from '@/widget/goods/list/GoodCompareComponent/GoodCompareComponent.ts';
import { GoodData } from '@/action/goods/types/good.types.ts';
import {
    GoodDropdownActions,
} from '@/widget/goods/list/GoodDropdownActions/GoodDropdownActions.ts';


export type GoodCategoryCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCategory: GoodsCategoryTreeFullData;
        clientCategories: Array<GoodsCategoryTreeFullData>;
        logger?: ILogger;
        fetcher?: IFetcher;
    }

export class GoodCategoryCompareComponent extends CompareComponent<GoodsCategoryTreeFullData> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _targetCategory: GoodsCategoryTreeFullData;
    private readonly _clientCategories: Array<GoodsCategoryTreeFullData>;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientCategory?: GoodsCategoryTreeFullData;
    private _childrenGoodCategories: Array<GoodCategoryCompareComponent> = [];
    private _childrenGoods: Array<GoodCompareComponent>                  = [];

    constructor (props: GoodCategoryCompareComponentProps) {
        const {
                  clientId,
                  bearer,
                  targetCategory,
                  clientCategories,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);
        this._clientId         = clientId;
        this._bearer           = bearer;
        this._targetCategory   = { ...targetCategory };
        this._clientCategories = clientCategories;
        this._logger           = logger;
        this._fetcher          = fetcher;
        this._clientCategory   = this._clientCategories.find((value) => value.title === this._targetCategory.title);

        this._render();
    }

    protected async _action (parentCategoryId: string): Promise<GoodsCategoryTreeFullData | null> {
        if (this._clientCategory) {
            if (this._itemIsValid()) {
                this._clientCategory.children = await new PromiseSplitter(1, 1).exec<GoodsCategoryTreeFullData>(
                    this._getChildrenCategories().map((child) => ({
                        chain: [ child.getAction(this._clientCategory!.id) ],
                    })),
                );
                this._clientCategory.goods    = await new PromiseSplitter(1, 1).exec<GoodData>(
                    this._getChildrenGoods().map((child) => ({
                        chain: [ child.getAction(this._clientCategory!.id) ],
                    })),
                );
                return this._clientCategory;
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    await updateGoodCategoryRequestAction(
                        this._clientId,
                        this._clientCategory.id,
                        {
                            title  : this._targetCategory.title,
                            comment: this._targetCategory.comment,
                            article: this._targetCategory.article,
                            pid    : parentCategoryId,
                        },
                        this._fetcher,
                        this._logger,
                    );

                    this._clientCategory.title   = this._targetCategory.title;
                    this._clientCategory.comment = this._targetCategory.comment;
                    this._clientCategory.article = this._targetCategory.article;

                    // return item
                    return this._clientCategory;
                } else {
                    // update item
                    await updateGoodCategoryRequestAction(
                        this._clientId,
                        this._clientCategory.id,
                        {
                            title  : this._targetCategory.title,
                            comment: this._targetCategory.comment,
                            article: this._targetCategory.article,
                            pid    : parentCategoryId,
                        },
                        this._fetcher,
                        this._logger,
                    );

                    this._clientCategory.title    = this._targetCategory.title;
                    this._clientCategory.comment  = this._targetCategory.comment;
                    this._clientCategory.article  = this._targetCategory.article;
                    // action children
                    this._clientCategory.children = await new PromiseSplitter(1, 1).exec<GoodsCategoryTreeFullData>(
                        this._getChildrenCategories().map((child) => ({
                            chain: [ child.getAction(this._clientCategory!.id) ],
                        })),
                    );
                    this._clientCategory.goods    = await new PromiseSplitter(1, 1).exec<GoodData>(
                        this._getChildrenGoods().map((child) => ({
                            chain: [ child.getAction(this._clientCategory!.id) ],
                        })),
                    );
                    // return item
                    return this._clientCategory;
                }
            }
        } else {
            if (!this._isNoCreateNew()) {
                // create item
                const categoryId = await createGoodsCategoryRequestAction(
                    this._clientId,
                    {
                        title  : this._targetCategory.title,
                        comment: this._targetCategory.comment,
                        article: this._targetCategory.article,
                        pid    : parentCategoryId,
                    },
                    this._fetcher,
                    this._logger,
                );

                const category = await getGoodsCategoryRequestAction(
                    this._clientId,
                    categoryId,
                    this._logger,
                );

                if (!this._childrenIsValid()) {
                    const children = await new PromiseSplitter(1, 1).exec<GoodsCategoryTreeFullData>(
                        this._getChildrenCategories().map((child) => ({
                            chain: [ child.getAction(category.id) ],
                        })),
                    );

                    const goods = await new PromiseSplitter(1, 1).exec<GoodData>(
                        this._getChildrenGoods().map((child) => ({
                            chain: [ child.getAction(category.id) ],
                        })),
                    );

                    // return item
                    return { ...category, children, goods };
                }

                // return item
                return { ...category, children: [], goods: [] };
            }

            return null;
        }
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return [
            ...this._getChildrenCategories(),
            ...this._getChildrenGoods(),
        ];
    }

    private _getChildrenCategories () {
        return this._childrenGoodCategories;
    }

    private _getChildrenGoods () {
        return this._childrenGoods;
    }

    protected _render (): void {
        this._beforeRender();

        this._compareRows     = [
            new CompareBox({
                title     : 'Информация',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetCategory.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.id,
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
                        label      : 'Артикул',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetCategory.article,
                            type   : 'text',
                            onInput: (article) => {
                                this._targetCategory.article = article;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.article,
                        }),
                        disable    : this._clientCategory?.isChainCategory,
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Комментарий',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetCategory.comment,
                            type   : 'text',
                            onInput: (comment) => {
                                this._targetCategory.comment = comment;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.comment,
                        }),
                        disable    : this._clientCategory?.isChainCategory,
                        parent     : this,
                    }),
                ],
            }),
        ];
        this._compareChildren = [
            new CompareBoxWithoutValidation({
                title     : 'Массовые действия',
                level     : 3,
                components: [
                    new Row({
                        cols: [
                            new GoodCategoryDropdownActions({
                                compareEntity    : this,
                                withCurrentHeader: false,
                            }),
                            new GoodDropdownActions({
                                compareEntity: this,
                            }),
                        ],
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Товары',
                level     : 3,
                components: this._childrenGoods = this._targetCategory.goods.map((good) => (
                    new GoodCompareComponent({
                        clientId   : this._clientId,
                        targetGood : good,
                        clientGoods: this._clientCategory?.goods ?? [],
                        parent     : this,
                        logger     : this._logger,
                        fetcher    : this._fetcher,
                    })
                )),
            }),
            new CompareBox({
                title     : 'Категории товаров',
                level     : 3,
                components: this._childrenGoodCategories = this._targetCategory.children.map((childCategory) => (
                    new GoodCategoryCompareComponent({
                        clientId        : this._clientId,
                        bearer          : this._bearer,
                        targetCategory  : childCategory,
                        clientCategories: this._clientCategory?.children ?? [],
                        parent          : this,
                        logger          : this._logger,
                        fetcher         : this._fetcher,
                    })
                )),
            }),
        ];
        this._header          = new CompareHeader({
            label           : 'Категория товаров',
            targetHeaderData: this._targetCategory.title,
            clientHeaderData: this._clientCategory?.title,
            variants        : this._clientCategories.map((category) => ({
                value   : category.id,
                label   : category.title,
                selected: category.id === this._clientCategory?.id,
            })),
            rows            : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            onVariantChange : (variant) => {
                this._clientCategory = this._clientCategories.find((category) => category.id === variant.value);
                this._render();
            },
            onRename        : (title: string) => {
                this._targetCategory.title = title;
            },
            disable         : this._clientCategory?.isChainCategory,
            type            : GOOD_CATEGORY_HEADER_TYPE,
        });

        this._beforeEndRender(this._clientCategory);
    }
}