import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { getTableData } from '@/helper/lib/table/getTableData.ts';
import {
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import {
    createFinancesSupplierRequestAction,
    FinancesSupplierCreateData,
} from '@/action/finances/suppliers/request-actions/createFinancesSupplier.request-action.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import {
    getFinancesSuppliersRequestAction,
} from '@/action/finances/suppliers/request-actions/getFinancesSuppliers.request-action.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { Converter } from '@/converter/Converter.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export type AddFinancesSuppliersModalProps = {
    clientId: string;
};

export class AddFinancesSuppliersModal extends ModalButton {
    private readonly _clientId: string;
    private readonly _content: Col;
    private readonly _logger: Logger           = new Logger({});
    private readonly _fetcher: IFetcher        = new MemoFetch();
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });

    constructor (props: AddFinancesSuppliersModalProps) {
        const { clientId } = props;
        const content      = new Col({ rows: [] });
        super({
            textContent: 'Добавить множество',
            styleType  : ButtonStyleType.PRIMARY,
            modalProps : {
                label      : 'Добавить множество',
                content,
                preferWidth: Modal.getPreferWidthByNesting(3),
            },
        });

        this._clientId = clientId;
        this._content  = content;
        this._content.add(this._logger);
        this._content.add(this._progressBar);

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const parseButton = new Button({
            textContent: 'Обработать',
            onclick    : async () => {
                const data = this._getDataToCreate(dataTextarea.getValue());

                if (noRepeatLabel.getState()) {
                    parseButton.setLoading(true);
                    dataTextarea.setDisable(true);
                    noRepeatLabel.setDisable(true);

                    const clientData = await getFinancesSuppliersRequestAction(this._clientId, this._logger);

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

                parseButton.remove();
                dataTextarea.remove();
                noRepeatLabel.remove();
            },
        });

        const dataTextarea = new TextArea({
            placeholder : `Введите данные Тип/Название/ИНН/КПП/Контактное лицо/Телефон/Email/Адрес/Комментарий`,
            preferHeight: 150,
        });

        const noRepeatLabel = new CheckboxWithLabel({
            label: 'Без повторений',
        });

        this._content.add(dataTextarea);
        this._content.add(noRepeatLabel);
        this._content.add(parseButton);
    }

    private _renderTable (data: Array<FinancesSupplierCreateData>): void {
        const table = new Table({
            header: [
                '',
                'Тип',
                'Название',
                'ИНН',
                'КПП',
                'Контактное лицо',
                'Телефон',
                'Email',
                'Адрес',
                'Комментарий',
            ],
        });

        data.forEach((item) => {
            table.addRow([
                '',
                Converter.Finances.Supplier.type(item.type),
                item.title,
                item.inn,
                item.kpp,
                item.contact,
                item.phone,
                item.email,
                item.addr,
                item.comment,
            ]);
        });

        const createButton = new Button({
            textContent: 'Создать',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : () => {
                let errors: number  = 0;
                let success: number = 0;
                const self          = this;

                createButton.setLoading(true);

                this._progressBar.reset(data.length);

                new PromiseSplitter(5, 2).exec(
                    data.map((item, index) => ({
                        chain: [
                            () => createFinancesSupplierRequestAction(this._clientId, item, this._fetcher, this._logger),
                        ],
                        onError () {
                            self._progressBar.setRightProgress(++errors);
                            table.updateRow(index, [
                                '-',
                                Converter.Finances.Supplier.type(item.type),
                                item.title,
                                item.inn,
                                item.kpp,
                                item.contact,
                                item.phone,
                                item.email,
                                item.addr,
                                item.comment,
                            ]);
                        },
                        onSuccess () {
                            self._progressBar.setLeftProgress(++success);
                            table.updateRow(index, [
                                '✓',
                                Converter.Finances.Supplier.type(item.type),
                                item.title,
                                item.inn,
                                item.kpp,
                                item.contact,
                                item.phone,
                                item.email,
                                item.addr,
                                item.comment,
                            ]);
                        },
                    })),
                )
                    .finally(() => {
                        createButton.element.textContent = 'Завершено';
                        createButton.element.disabled    = true;
                        createButton.element.onclick     = () => {
                        };
                        createButton.setLoading(false);
                    });
            },
        });

        this._content.add(createButton);
        this._content.add(table);
    }

    private _getDataToCreate (data: string): Array<FinancesSupplierCreateData> {
        return getTableData(data).map((item) => ({
            type   : item[0] === 'физ' ? FinancesSupplierType.FIZ
                                       : item[0] === 'ип'
                                         ? FinancesSupplierType.IP
                                         : FinancesSupplierType.YR,
            title  : item[1],
            inn    : item[2],
            kpp    : item[3],
            contact: item[4],
            phone  : item[5],
            email  : item[6],
            addr   : item[7],
            comment: item[8],
        }));
    }
}