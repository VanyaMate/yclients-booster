import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { GoodData } from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    updateGoodRequestAction,
} from '@/action/goods/request-actions/updateGood.request-action.ts';
import {
    createGoodRequestAction,
} from '@/action/goods/request-actions/createGood.request-action.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import { UnitMapper } from '@/mapper/UnitMapper.ts';
import { TaxMapper } from '@/mapper/TaxMapper.ts';
import { Converter } from '@/converter/Converter.ts';
import { VatMapper } from '@/mapper/VatMapper.ts';
import { isUndefined } from '@vanyamate/types-kit';


export type GoodCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        clientGoods: Array<GoodData>;
        targetGood: GoodData;
        logger?: ILogger;
        fetcher?: IFetcher;
    }

export class GoodCompareComponent extends CompareComponent<GoodData> {
    private readonly _clientId: string;
    private readonly _clientGoods: Array<GoodData>;
    private readonly _targetGood: GoodData;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientGood?: GoodData;

    constructor (props: GoodCompareComponentProps) {
        const {
                  clientId,
                  clientGoods,
                  targetGood,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId    = clientId;
        this._clientGoods = clientGoods;
        this._targetGood  = { ...targetGood };
        this._logger      = logger;
        this._fetcher     = fetcher;

        this._clientGood = this._clientGoods.find((good) => this._targetGood.title === good.title);
        this._render();
    }

    protected async _action (categoryId: string): Promise<GoodData | null> {
        if (this._clientGood) {
            if (this._itemIsValid()) {
                return this._clientGood;
            } else {
                // update item
                // return item
                return await updateGoodRequestAction(
                    this._clientId,
                    this._clientGood.id,
                    {
                        ...this._targetGood,
                        category_id: Number(categoryId),
                    },
                    this._fetcher,
                    this._logger,
                );
            }
        } else {
            if (!this._isNoCreateNew()) {
                // create item
                // return item
                return await createGoodRequestAction(
                    this._clientId,
                    {
                        ...this._targetGood,
                        category_id: Number(categoryId),
                    },
                    this._fetcher,
                    this._logger,
                );
            }

            return null;
        }
    }

    protected _render (): void {
        this._beforeRender();
        this._compareRows = [
            new CompareBox({
                title     : 'Информация',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetGood.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.id,
                        }),
                        validate   : false,
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Название в чеке',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.print_title,
                            onInput: (value) => {
                                this._targetGood.print_title = value;
                            },
                            type   : 'text',
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.print_title,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Артикул',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.article.toString(),
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.article = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.article.toString(),
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Штрихкод',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.barcode,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.barcode = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.barcode,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Цена продажи',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.cost,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.cost = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.cost,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Себестоимость',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.actual_cost,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.actual_cost = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.actual_cost,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Критичный остаток',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.critical_amount,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.critical_amount = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.critical_amount,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Критичный остаток',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.desired_amount,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.desired_amount = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.desired_amount,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Комментарий',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.comment,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.comment = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.comment,
                        }),
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Единицы измерения',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Для продажи',
                        targetValue: new CompareSelectValue({
                            defaultValue    : '',
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : Object.entries(UnitMapper).map(([ id, name ]) => ({
                                label   : name,
                                value   : id,
                                selected: this._targetGood.sale_unit_id.toString() === id,
                            })),
                            onChange        : (variant) => {
                                this._targetGood.sale_unit_id = Number(variant.value);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.sale_unit_id.toString(),
                            label: this._clientGood?.sale_unit_id
                                   ? UnitMapper[this._clientGood.sale_unit_id.toString() as keyof typeof UnitMapper]
                                   : '',
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Для списания',
                        targetValue: new CompareSelectValue({
                            defaultValue    : '',
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : Object.entries(UnitMapper).map(([ id, name ]) => ({
                                label   : name,
                                value   : id,
                                selected: this._targetGood.service_unit_id.toString() === id,
                            })),
                            onChange        : (variant) => {
                                this._targetGood.service_unit_id = Number(variant.value);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.service_unit_id.toString(),
                            label: this._clientGood?.service_unit_id
                                   ? UnitMapper[this._clientGood.service_unit_id.toString() as keyof typeof UnitMapper]
                                   : '',
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Равно',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.unit_equals,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.unit_equals = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.unit_equals,
                        }),
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Массы',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Нетто',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.netto,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.netto = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.netto,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Брутто',
                        targetValue: new CompareTextInputValue({
                            value  : this._targetGood.brutto,
                            type   : 'text',
                            onInput: (value) => {
                                this._targetGood.brutto = value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.brutto,
                        }),
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Налогообложение',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Система',
                        targetValue: new CompareSelectValue({
                            defaultValue    : '',
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : Object.entries(TaxMapper).map(([ id, name ]) => ({
                                label   : name,
                                value   : id,
                                selected: this._targetGood.tax_variant.toString() === id,
                            })),
                            onChange        : (variant) => {
                                this._targetGood.tax_variant = Number(variant.value);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.tax_variant.toString(),
                            label: !isUndefined(this._clientGood?.tax_variant)
                                   ? Converter.taxVariant(this._clientGood.tax_variant)
                                   : '',
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'НДС',
                        targetValue: new CompareSelectValue({
                            defaultValue    : '',
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : Object.entries(VatMapper).map(([ id, name ]) => ({
                                label   : name,
                                value   : id,
                                selected: this._targetGood.vat_id.toString() === id,
                            })),
                            onChange        : (variant) => {
                                this._targetGood.vat_id = Number(variant.value);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientGood?.vat_id.toString(),
                            label: !isUndefined(this._clientGood?.vat_id)
                                   ? Converter.vatId(this._clientGood.vat_id)
                                   : '',
                        }),
                        parent     : this,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            label           : 'Товар',
            targetHeaderData: this._targetGood.title,
            clientHeaderData: this._clientGood?.title,
            rows            : this._compareRows,
            variants        : this._clientGoods.map((good) => ({
                value   : good.id,
                label   : good.title,
                selected: good.id === this._clientGood?.id,
            })),
            onVariantChange : (variant) => {
                this._clientGood = this._clientGoods.find((good) => good.id === variant.value);
                this._render();
            },
            onRename        : (title) => {
                this._targetGood.title = title;
            },
        });

        this._beforeEndRender(this._clientGood);
    }
}