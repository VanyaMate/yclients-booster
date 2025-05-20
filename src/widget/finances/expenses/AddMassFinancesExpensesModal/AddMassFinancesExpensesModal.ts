import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { getTableData } from '@/helper/lib/table/getTableData.ts';
import {
    FinancesExpenseCreateData,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    getFinancesExpensesListRequestAction,
} from '@/action/finances/expenses/request-actions/getFinancesExpensesList.request-action.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    createFinancesExpenseRequestAction,
} from '@/action/finances/expenses/request-actions/createFinancesExpense.request-action.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export type AddMassFinancesExpensesModalProps = {
    clientId: string;
}

export class AddMassFinancesExpensesModal extends ModalButton {
    private readonly _clientId: string;
    private readonly _logger: Logger           = new Logger({});
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });
    private readonly _content: Col;
    private readonly _fetcher: IFetcher        = new MemoFetch();

    constructor (props: AddMassFinancesExpensesModalProps) {
        const { clientId } = props;
        const content      = new Col({ rows: [] });
        super({
            textContent: 'Добавить множество',
            styleType  : ButtonStyleType.PRIMARY,
            modalProps : {
                label      : 'Добавить множество',
                content,
                preferWidth: Modal.getPreferWidthByNesting(1),
            },
        });

        this._clientId = clientId;
        this._content  = content;

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        this._content.clear();
        this._content.add(this._logger);
        this._content.add(this._progressBar);

        const dataTextarea     = new TextArea({
            placeholder: 'Введите данные Тип/Заголовок/Комментарий',
        });
        const noRepeatCheckbox = new CheckboxWithLabel({
            label: 'Без повторений',
        });
        const getDataButton    = new Button({
            textContent: 'Получить данные',
            onclick    : async () => {
                const data = this._getDataForCreate(dataTextarea.getValue());
                if (noRepeatCheckbox.getState()) {
                    getDataButton.setLoading(true);
                    dataTextarea.setDisable(true);
                    noRepeatCheckbox.setDisable(true);

                    const clientData = await getFinancesExpensesListRequestAction(this._clientId, this._logger);
                    this._renderTable(
                        data.filter(
                            (item) => !clientData.some(
                                (clientItem) => clientItem.title === item.title,
                            ),
                        ),
                    );
                } else {
                    this._renderTable(data);
                }

                getDataButton.remove();
                noRepeatCheckbox.remove();
                dataTextarea.remove();
            },
        });

        this._content.add(dataTextarea);
        this._content.add(noRepeatCheckbox);
        this._content.add(getDataButton);
    }

    private _getDataForCreate (str: string): Array<FinancesExpenseCreateData> {
        return getTableData(str).map((row) => ({
            type   : Converter.Finances.Expenses.labelToType(row[0]),
            title  : row[1],
            comment: row[2],
        }));
    }

    private _renderTable (data: Array<FinancesExpenseCreateData>) {
        const table = new Table({
            header: [ '', 'Тип', 'Название', 'Комментарий' ],
        });

        data.forEach((row) => {
            table.addRow([
                '',
                Converter.Finances.Expenses.type(row.type),
                row.title,
                row.comment,
            ]);
        });

        const createButton = new Button({
            textContent: 'Создать',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : () => {
                let success = 0;
                let errors  = 0;
                createButton.setLoading(true);
                this._progressBar.reset(data.length);

                new PromiseSplitter(5, 2).exec(
                    data.map((item, index) => ({
                        chain    : [
                            () => createFinancesExpenseRequestAction(this._clientId, item, this._fetcher, this._logger),
                        ],
                        onSuccess: () => {
                            this._progressBar.setLeftProgress(++success);
                            table.updateRow(index, [
                                '✓',
                                Converter.Finances.Expenses.type(item.type),
                                item.title,
                                item.comment,
                            ]);
                        },
                        onError  : () => {
                            this._progressBar.setRightProgress(++errors);
                            table.updateRow(index, [
                                '-',
                                Converter.Finances.Expenses.type(item.type),
                                item.title,
                                item.comment,
                            ]);
                        },
                    })),
                )
                    .finally(() => {
                        createButton.setLoading(false);
                        createButton.element.textContent = 'Завершено';
                        createButton.element.disabled    = true;
                        createButton.element.onclick     = () => {
                        };
                    });
            },
        });

        this._content.add(createButton);
        this._content.add(table);
    }
}