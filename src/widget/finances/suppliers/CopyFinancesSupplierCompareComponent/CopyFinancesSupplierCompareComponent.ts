import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    FinancesSupplier, FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { SelectOption } from '@/shared/input/Select/Select.ts';
import { FINANCES_SUPPLIERS_HEADER_TYPE } from '@/widget/header-types.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { Converter } from '@/converter/Converter.ts';
import { isUndefined } from '@vanyamate/types-kit';
import {
    CompareBoxWithoutValidation,
} from '@/entity/compare/CompareWithoutValidation/CompareBoxWithoutValidation.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import {
    updateFinancesSupplierRequestAction,
} from '@/action/finances/suppliers/request-actions/updateFinancesSupplier.request-action.ts';
import {
    createFinancesSupplierRequestAction,
} from '@/action/finances/suppliers/request-actions/createFinancesSupplier.request-action.ts';


export type CopyFinancesSuppliersCompareProps =
    {
        clientId: string;
        clientSuppliers: Array<FinancesSupplier>;
        targetSupplier: FinancesSupplier;
        logger?: ILogger;
        fetcher?: IFetcher;
    }
    & CompareComponentProps;

export class CopyFinancesSupplierCompareComponent extends CompareComponent<FinancesSupplier> {
    private readonly _clientId: string;
    private readonly _clientSuppliers: Array<FinancesSupplier>;
    private readonly _targetSupplier: FinancesSupplier;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientSupplier?: FinancesSupplier;

    constructor (props: CopyFinancesSuppliersCompareProps) {
        const {
                  clientId,
                  clientSuppliers,
                  targetSupplier,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId        = clientId;
        this._clientSuppliers = clientSuppliers;
        this._targetSupplier  = targetSupplier;
        this._logger          = logger;
        this._fetcher         = fetcher;
        this._clientSupplier  = this._clientSuppliers.find((supplier) => this._targetSupplier.title === supplier.title);

        this._render();
    }

    protected async _action (): Promise<FinancesSupplier | null> {
        if (this._clientSupplier) {
            if (this._itemIsValid()) {
                return this._clientSupplier;
            } else {
                await updateFinancesSupplierRequestAction(
                    this._clientId,
                    this._clientSupplier.id,
                    this._targetSupplier,
                    this._fetcher,
                    this._logger,
                );
            }
        } else {
            if (!this._isNoCreateNew()) {
                await createFinancesSupplierRequestAction(
                    this._clientId,
                    this._targetSupplier,
                    this._fetcher,
                    this._logger,
                );
            }
        }
        return null;
    }

    protected _render (): void {
        this._beforeRender();

        this._compareRows = [
            new CompareBoxWithoutValidation({
                level     : 2,
                title     : 'Информация',
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetSupplier.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.id,
                        }),
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                level     : 2,
                title     : 'Данные',
                components: [
                    new CompareRow({
                        label      : 'Тип',
                        targetValue: new CompareSelectValue({
                            defaultValue    : this._targetSupplier.type,
                            showDefaultLabel: false,
                            showValue       : false,
                            defaultLabel    : '',
                            list            : [
                                {
                                    value   : FinancesSupplierType.YR,
                                    selected: FinancesSupplierType.YR === this._targetSupplier.type,
                                    label   : Converter.Finances.Supplier.type(FinancesSupplierType.YR),
                                },
                                {
                                    value   : FinancesSupplierType.IP,
                                    selected: FinancesSupplierType.IP === this._targetSupplier.type,
                                    label   : Converter.Finances.Supplier.type(FinancesSupplierType.IP),
                                },
                                {
                                    value   : FinancesSupplierType.FIZ,
                                    selected: FinancesSupplierType.FIZ === this._targetSupplier.type,
                                    label   : Converter.Finances.Supplier.type(FinancesSupplierType.FIZ),
                                },
                            ],
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.type,
                            label: !isUndefined(this._clientSupplier?.type)
                                   ? Converter.Finances.Supplier.type(this._clientSupplier.type)
                                   : undefined,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'ИНН',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.inn,
                            onInput: (inn: string) => {
                                this._targetSupplier.inn = inn;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.inn,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'КПП',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.kpp,
                            onInput: (kpp: string) => {
                                this._targetSupplier.kpp = kpp;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.kpp,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Контактное лицо',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.contact,
                            onInput: (contact: string) => {
                                this._targetSupplier.contact = contact;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.contact,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Телефон',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.phone,
                            onInput: (phone: string) => {
                                this._targetSupplier.phone = phone;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.phone,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Email',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.email,
                            onInput: (email: string) => {
                                this._targetSupplier.email = email;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.email,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Адрес',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.addr,
                            onInput: (address: string) => {
                                this._targetSupplier.addr = address;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.addr,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Комментарий',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetSupplier.comment,
                            onInput: (comment: string) => {
                                this._targetSupplier.comment = comment;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientSupplier?.comment,
                        }),
                        parent     : this,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            label           : 'Контрагент',
            targetHeaderData: this._targetSupplier.title,
            clientHeaderData: this._clientSupplier?.title,
            variants        : this._clientSuppliers.map((supplier) => ({
                label   : supplier.title,
                selected: this._clientSupplier?.id === supplier.id,
                value   : supplier.id,
            })),
            rows            : this._compareRows,
            onVariantChange : (e: SelectOption<string>) => {
                this._clientSupplier = this._clientSuppliers.find((supplier) => supplier.id === e.value);
                this._render();
            },
            onRename        : (title: string) => {
                this._targetSupplier.title = title;
            },
            type            : FINANCES_SUPPLIERS_HEADER_TYPE,
            parent          : this,
            compareType     : this._compareType,
        });

        this._beforeEndRender(this._clientSupplier);
    }
}