import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    GoodCategoriesCopyData,
    GoodsCategoryFullData, GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';


export type GoodCategoryCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCategory: GoodsCategoryTreeFullData;
        clientCategories: GoodCategoriesCopyData;
        logger?: ILogger;
        fetcher?: IFetcher;
    }

export class GoodCategoryCompareComponent extends CompareComponent<GoodsCategoryFullData> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _targetCategory: GoodsCategoryTreeFullData;
    private readonly _clientCategories: GoodCategoriesCopyData;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientCategory?: GoodsCategoryTreeFullData;

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
        this._targetCategory   = targetCategory;
        this._clientCategories = clientCategories;
        this._logger           = logger;
        this._fetcher          = fetcher;
        this._clientCategory   = Object.values(this._clientCategories.mapper).find((value) => value.title === this._targetCategory.title);
    }

    protected _action (parentId: string | null): Promise<GoodsCategoryFullData | null> {
        console.log('ParentId', parentId);
        console.log('logs', this._clientId, this._bearer, this._logger, this._fetcher);
        throw new Error('Method not implemented.');
    }

    protected _render (): void {
        this._beforeRender();

        this._compareRows     = [
            new CompareBox({
                title     : 'Информация',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : '',
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
                        label      : 'Родительская категория',
                        targetValue: new CompareSelectValue({
                            defaultValue: 'Родительская',
                            defaultLabel: '0',
                            list        : Object.values(this._clientCategories.mapper).map((category) => ({
                                value   : category.id,
                                label   : category.title,
                                selected: this._targetCategory.title === category.parent?.title,
                            })),
                            onChange    : (select) => {
                                if (select.value === '0') {
                                    this._targetCategory.parent = null;
                                } else {
                                    this._targetCategory.parent = {
                                        id   : select.value,
                                        title: select.label,
                                    };
                                }
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.parent?.id,
                            label: this._clientCategories.mapper[this._clientCategory?.parent?.id ?? ''].title,
                        }),
                    }),
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
                    }),
                ],
            }),
        ];
        this._compareChildren = [];
        this._header          = new CompareHeader({
            label           : 'Категория товаров',
            targetHeaderData: this._targetCategory.title,
            clientHeaderData: this._clientCategory?.title,
            variants        : Object.values(this._clientCategories.mapper).map((category) => ({
                value   : category.id,
                label   : category.title,
                selected: category.id === this._clientCategory?.id,
            })),
            rows            : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            onVariantChange : (variant) => {
                this._clientCategory = this._clientCategories.mapper[variant.value];
                this._render();
            },
            onRename        : (title: string) => {
                this._targetCategory.title = title;
            },
        });

        this._beforeEndRender();
    }
}