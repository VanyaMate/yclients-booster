import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { getTableData } from '@/helper/lib/table/getTableData.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    createStuffRequestAction,
} from '@/action/settings/stuff/createStuff.request-action.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import {
    getStuffListFromApiRequestAction,
} from '@/action/settings/stuff/getStuffListFromApi.request-action.ts';


export type FilialStuffCreateItem = {
    name: string;
    specialization: string;
    fired: boolean;
}

export type SettingsFilialStuffCreateModalProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class SettingsFilialStuffCreateModal extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger           = new Logger({});
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });
    private readonly _content: Col             = new Col({ rows: [] });

    constructor (props: SettingsFilialStuffCreateModalProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;

        new ModalButton({
            textContent: 'Массовое создание сотрудников',
            styleType  : ButtonStyleType.PRIMARY,
            modalProps : {
                label      : 'Массовое создание сотрудников',
                content    : this._content,
                preferWidth: Modal.getPreferWidthByNesting(2),
            },
            fullWidth  : true,
        })
            .insert(this.element, 'afterbegin');

        this._content.add(this._logger);
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const textarea       = new TextArea({
            placeholder: `Вставьте данные из таблицы в формате "Имя Специализация Уволен"`,
        });
        const parseButton    = new Button({
            textContent: 'Обработать данные',
            styleType  : ButtonStyleType.DEFAULT,
            onclick    : async () => {
                const data  = this._getDataFromString(textarea.getValue());
                const stuff = withoutOverlap.getState()
                              ? await getStuffListFromApiRequestAction(this._bearer, this._clientId, this._logger)
                              : [];

                textarea.remove();
                withoutOverlap.remove();
                parseButton.remove();

                this._renderCompareTable(
                    data.filter(
                        (item) => stuff.every(
                            (empl) => empl.name.toLowerCase() !== item.name.toLowerCase(),
                        ),
                    ),
                );
            },
        });
        const withoutOverlap = new CheckboxWithLabel({
            label: 'Убрать повторения',
        });
        this._content.add(textarea);
        this._content.add(withoutOverlap);
        this._content.add(parseButton);
    }

    private _renderCompareTable (data: Array<FilialStuffCreateItem>) {
        const table = new Table({
            header: [ '', 'Имя', 'Специализация', 'Уволен' ],
        });
        data.forEach((item) => table.addRow([
            '',
            item.name,
            item.specialization,
            item.fired ? 'да' : 'нет',
        ]));
        const createButton = new Button({
            styleType  : ButtonStyleType.PRIMARY,
            textContent: 'Создать',
            onclick    : () => {
                createButton.setLoading(true);
                this._progressBar.reset(data.length);
                this._progressBar.insert(this._logger.element, 'afterend');

                let success = 0;
                let errors  = 0;

                new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY)
                    .exec(
                        data.map((item, index) => ({
                            chain    : [
                                () => createStuffRequestAction(
                                    this._bearer,
                                    this._clientId,
                                    item,
                                    new Fetch(),
                                    this._logger,
                                ),
                            ],
                            onSuccess: () => {
                                this._progressBar.setLeftProgress(++success);
                                table.updateRow(index, [
                                    '+',
                                    item.name,
                                    item.specialization,
                                    item.fired ? 'да' : 'нет',
                                ]);
                            },
                            onError  : () => {
                                this._progressBar.setRightProgress(++errors);
                                table.updateRow(index, [
                                    'х',
                                    item.name,
                                    item.specialization,
                                    item.fired ? 'да' : 'нет',
                                ]);
                            },
                        })),
                    )
                    .finally(() => {
                        createButton.setLoading(false);
                        createButton.element.disabled    = true;
                        createButton.element.textContent = 'Завершено';
                    });
            },
        });
        this._content.add(table);
        this._content.add(createButton);
    }

    private _getDataFromString (str: string): Array<FilialStuffCreateItem> {
        return getTableData(str).map((item) => ({
            name          : item[0],
            specialization: item[1],
            fired         : item[2] === 'да',
        }));
    }
}