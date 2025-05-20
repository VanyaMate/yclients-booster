import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    FinancesExpense, FinancesExpenseType,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { SelectOption } from '@/shared/input/Select/Select.ts';
import {
    FINANCES_EXPENSES_HEADER_TYPE,
} from '@/widget/header-types.ts';
import {
    CompareBoxWithoutValidation,
} from '@/entity/compare/CompareWithoutValidation/CompareBoxWithoutValidation.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import { Converter } from '@/converter/Converter.ts';
import { isUndefined } from '@vanyamate/types-kit';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import {
    updateFinancesExpenseRequestAction,
} from '@/action/finances/expenses/request-actions/updateFinancesExpense.request-action.ts';
import {
    createFinancesExpenseRequestAction,
} from '@/action/finances/expenses/request-actions/createFinancesExpense.request-action.ts';


export type CopyFinancesExpenseCompareComponentProps =
    {
        clientId: string;
        targetExpense: FinancesExpense;
        clientExpenses: Array<FinancesExpense>;
        fetcher?: IFetcher;
        logger?: ILogger;
    }
    & CompareComponentProps;

export class CopyFinancesExpenseCompareComponent extends CompareComponent<null> {
    private readonly _clientId: string;
    private readonly _targetExpense: FinancesExpense;
    private readonly _clientExpenses: Array<FinancesExpense>;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _clientExpense?: FinancesExpense;

    constructor (props: CopyFinancesExpenseCompareComponentProps) {
        const {
                  clientExpenses,
                  targetExpense,
                  clientId,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId       = clientId;
        this._targetExpense  = targetExpense;
        this._clientExpenses = clientExpenses;
        this._fetcher        = fetcher;
        this._logger         = logger;

        this._clientExpense = this._clientExpenses.find((expense) => expense.title === this._targetExpense.title);

        this._render();
    }

    protected async _action (): Promise<null> {
        if (this._clientExpense) {
            if (!this._itemIsValid()) {
                await updateFinancesExpenseRequestAction(
                    this._clientId,
                    this._clientExpense.id,
                    this._targetExpense,
                    this._fetcher,
                    this._logger,
                );
            }
        } else {
            if (!this._isNoCreateNew()) {
                await createFinancesExpenseRequestAction(
                    this._clientId,
                    this._targetExpense,
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
                            value: this._targetExpense.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientExpense?.id,
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
                            defaultValue    : this._targetExpense.type,
                            showDefaultLabel: false,
                            showValue       : false,
                            defaultLabel    : '',
                            list            : [
                                {
                                    value   : FinancesExpenseType.PROFIT,
                                    selected: FinancesExpenseType.PROFIT === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.PROFIT),
                                },
                                {
                                    value   : FinancesExpenseType.EXPENSES_SEBES,
                                    selected: FinancesExpenseType.EXPENSES_SEBES === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.EXPENSES_SEBES),
                                },
                                {
                                    value   : FinancesExpenseType.EXPENSES_COMM,
                                    selected: FinancesExpenseType.EXPENSES_COMM === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.EXPENSES_COMM),
                                },
                                {
                                    value   : FinancesExpenseType.EXPENSES_STUFF,
                                    selected: FinancesExpenseType.EXPENSES_STUFF === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.EXPENSES_STUFF),
                                },
                                {
                                    value   : FinancesExpenseType.EXPENSES_ADMIN,
                                    selected: FinancesExpenseType.EXPENSES_ADMIN === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.EXPENSES_ADMIN),
                                },
                                {
                                    value   : FinancesExpenseType.TAX,
                                    selected: FinancesExpenseType.TAX === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.TAX),
                                },
                                {
                                    value   : FinancesExpenseType.EXPENSES_OTHER,
                                    selected: FinancesExpenseType.EXPENSES_OTHER === this._targetExpense.type,
                                    label   : Converter.Finances.Expenses.type(FinancesExpenseType.EXPENSES_OTHER),
                                },
                            ],
                            onChange        : (option) => {
                                this._targetExpense.type = option.value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientExpense?.type,
                            label: !isUndefined(this._clientExpense?.type)
                                   ? Converter.Finances.Expenses.type(this._clientExpense.type)
                                   : undefined,
                        }),
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Комментарий',
                        targetValue: new CompareTextInputValue({
                            type   : 'text',
                            value  : this._targetExpense.comment,
                            onInput: (value) => this._targetExpense.comment = value,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientExpense?.comment,
                        }),
                        parent     : this,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            label           : 'Статья расхода',
            targetHeaderData: this._targetExpense.title,
            clientHeaderData: this._clientExpense?.title,
            variants        : this._clientExpenses.map((expense) => ({
                label   : expense.title,
                selected: this._clientExpense?.id === expense.id,
                value   : expense.id,
            })),
            rows            : this._compareRows,
            onVariantChange : (e: SelectOption<string>) => {
                this._clientExpense = this._clientExpenses.find((expense) => expense.id === e.value);
                this._render();
            },
            onRename        : (title: string) => {
                this._targetExpense.title = title;
            },
            type            : FINANCES_EXPENSES_HEADER_TYPE,
            parent          : this,
            compareType     : this._compareType,
        });

        this._beforeEndRender(this._clientExpense);
    }

}