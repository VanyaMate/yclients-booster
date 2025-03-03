import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import {
    SettingsServiceOnlineTitleUpdateAction,
} from '@/widget/settings/service/SettingsServiceOnlineTitleUpdateAction/SettingsServiceOnlineTitleUpdateAction.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';


export type SettingsServiceOnlineTitleUpdateFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export type ServiceOnlineTitleUpdateItem = {
    id: string;
    onlineTitleBefore: string | null;
    onlineTitleAfter: string;
    checkTitleBefore: string | null;
    checkTitleAfter: string;
}

export class SettingsServiceOnlineTitleUpdateForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger;
    private readonly _content: Col;

    constructor (props: SettingsServiceOnlineTitleUpdateFormProps) {
        super('div', {});

        this._clientId = props.clientId;
        this._bearer   = props.bearer;
        this._logger   = new Logger({});
        this._content  = new Col({ rows: [ this._logger ] });
        this._content.insert(this.element, 'afterbegin');

        this._renderForm();
    }

    private _renderForm () {
        const form = new TextArea({
            placeholder: 'Формат Id/Название в чеке/Название для ОЗ',
        });

        const compareButton = new Button({
            textContent: 'Сравнить и проверить',
            onclick    : async () => {
                compareButton.setLoading(true);
                const inputData = this._parseFormInput(form.getValue());
                this._fillFormInput(inputData)
                    .then((result) => {
                        form.remove();
                        compareButton.remove();
                        this._renderCompare(result);
                    })
                    .catch((error) => {
                        compareButton.setLoading(false);
                        this._logger.error(error);
                    });
            },
        });

        this._content.add(form);
        this._content.add(compareButton);
    }

    private _renderCompare (compareData: Array<ServiceOnlineTitleUpdateItem>) {
        const validItems: Array<ServiceOnlineTitleUpdateItem> = [];

        const nonValidTable = new Table({
            header: [ 'id' ],
        });

        const validTable = new Table({
            header: [ 'id', 'Чек (До)', 'Чек (После)', 'ОЗ (До)', 'Оз (После)' ],
        });

        const startProcessButton = new Button({
            textContent: 'Преобразовать',
            onclick    : () => {
                nonValidTable.remove();
                validTable.remove();
                startProcessButton.remove();
                this._renderProcess(validItems);
            },
        });

        compareData.forEach((data) => {
            if (data.onlineTitleBefore === null || data.checkTitleBefore === null) {
                nonValidTable.addRow([
                    data.id,
                ]);
            } else {
                validItems.push(data);
                validTable.addRow([
                    data.id,
                    data.checkTitleBefore,
                    data.checkTitleAfter,
                    data.onlineTitleBefore,
                    data.onlineTitleAfter,
                ]);
            }
        });

        this._content.add(nonValidTable);
        this._content.add(validTable);
        this._content.add(startProcessButton);
    }

    private _renderProcess (input: Array<ServiceOnlineTitleUpdateItem>) {
        // Зарендерить список со всеми услугами
        const actionComponents = input.map((item) => {
            return new SettingsServiceOnlineTitleUpdateAction({
                clientId  : this._clientId,
                bearer    : this._bearer,
                updateData: item,
            });
        });

        actionComponents.forEach((component) => this._content.add(component));

        const button = new Button({
            textContent: 'Преобразовать',
            onclick    : () => {
                button.setLoading(true);
                new PromiseSplitter(5, 1)
                    .exec(
                        actionComponents.map((component) => ({
                            chain: [ component.getAction() ],
                        })),
                    )
                    .then(() => {
                        button.setLoading(false);
                        button.element.textContent = 'end';
                    });
            },
        });

        this._content.add(button);
    }

    private async _fillFormInput (services: Array<ServiceOnlineTitleUpdateItem>): Promise<Array<ServiceOnlineTitleUpdateItem>> {
        // Получить все услуги и заполнить информацию

        services.forEach((val) => {
            val.onlineTitleBefore = val.onlineTitleAfter;
            val.checkTitleBefore  = val.checkTitleAfter;
        });
        return services;
    }

    private _parseFormInput (input: string): Array<ServiceOnlineTitleUpdateItem> {
        const rows: Array<string> = input.split('\n');
        return rows.map((row) => {
            const [ id, checkTitle, onlineTitle ] = row.split('\t');
            return {
                id,
                checkTitleAfter  : checkTitle,
                onlineTitleAfter : onlineTitle,
                checkTitleBefore : null,
                onlineTitleBefore: null,
            };
        });
    }
}