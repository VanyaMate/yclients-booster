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
import {
    getSettingsServicesRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServices/getSettingsServices.request-action.ts';
import { isNull, isUndefined } from '@vanyamate/types-kit';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import css from './SettingsServiceOnlineTitleUpdateForm.module.css';


export type SettingsServiceOnlineTitleUpdateFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export type ServiceOnlineTitleUpdateItem = {
    id: string;
    onlineTitleBefore: string | null;
    onlineTitleAfter?: string;
    checkTitleBefore: string | null;
    checkTitleAfter?: string;
    data: SettingsServiceData | null;
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
        this.element.classList.add(css.container);

        this._renderForm();
    }

    private _renderForm () {
        const form = new TextArea({
            placeholder: 'Формат Id/Название в чеке/Название для ОЗ',
            className  : css.textarea,
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

        const nonValidTitle = new LabelDivider({
            textContent: 'Невалидные данные',
        });
        const nonValidTable = new Table({
            header: [ 'id', 'Чек', 'ОЗ' ],
        });

        const validTitle = new LabelDivider({
            textContent: 'Валидные данные',
        });
        const validTable = new Table({
            header: [ 'id', 'Чек (До)', 'Чек (После)', 'ОЗ (До)', `ОЗ (После)` ],
        });

        const startProcessButton = new Button({
            textContent: 'Преобразовать',
            onclick    : () => {
                nonValidTitle.remove();
                nonValidTable.remove();
                validTitle.remove();
                validTable.remove();
                startProcessButton.remove();
                this._renderProcess(validItems);
            },
        });

        compareData.forEach((data) => {
            if (
                isNull(data.onlineTitleBefore) ||
                isNull(data.checkTitleBefore) ||
                isUndefined(data.checkTitleAfter) ||
                isUndefined(data.onlineTitleAfter) ||
                isNull(data.data)
            ) {
                nonValidTable.addRow([
                    data.id,
                    `${ data.checkTitleAfter }`,
                    `${ data.onlineTitleAfter }`,
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

        this._content.add(nonValidTitle);
        this._content.add(nonValidTable);
        this._content.add(validTitle);
        this._content.add(validTable);
        this._content.add(startProcessButton);
    }

    private _renderProcess (services: Array<ServiceOnlineTitleUpdateItem>) {
        const progressBar   = new ProgressBar({ max: services.length });
        let success: number = 0;
        let error: number   = 0;

        const actionComponents = services.map((service) => {
            return new SettingsServiceOnlineTitleUpdateAction({
                clientId   : this._clientId,
                bearer     : this._bearer,
                serviceData: service.data!,
                logger     : this._logger,
            });
        });

        this._content.add(progressBar);

        actionComponents.forEach((component) => this._content.add(component));

        const button = new Button({
            textContent: 'Преобразовать',
            onclick    : () => {
                button.setLoading(true);
                new PromiseSplitter(4, 1)
                    .exec(
                        actionComponents.map((component) => ({
                            chain    : [ component.getAction() ],
                            onSuccess: () => {
                                progressBar.setLeftProgress(++success);
                            },
                            onError  : () => {
                                progressBar.setRightProgress(++error);
                            },
                        })),
                    )
                    .then(() => {
                        button.setLoading(false);
                        button.element.disabled    = true;
                        button.element.textContent = 'Завершено';
                        button.element.onclick     = () => {
                        };
                    })
                    .catch(() => {
                        button.setLoading(false);
                        button.element.disabled    = true;
                        button.element.textContent = 'Произошла ошибка';
                        button.element.onclick     = () => {
                        };
                    });
            },
        });

        this._content.add(button);
    }

    private async _fillFormInput (services: Array<ServiceOnlineTitleUpdateItem>): Promise<Array<ServiceOnlineTitleUpdateItem>> {
        // Получить все услуги и заполнить информацию
        const allClientServices = await getSettingsServicesRequestAction(this._bearer, this._clientId, this._logger);

        for (let i = 0, clientService: SettingsServiceData | undefined = undefined, service: ServiceOnlineTitleUpdateItem | undefined = undefined; i < services.length; i++) {
            service       = services[i];
            clientService = allClientServices.data.find((clientService) => clientService.id.toString() === service.id);
            if (clientService) {
                service.checkTitleBefore   = clientService.print_title;
                service.onlineTitleBefore  = clientService.booking_title;
                service.data               = clientService;
                service.data.booking_title = service.onlineTitleAfter!;
                service.data.print_title   = service.checkTitleAfter!;
            }
        }

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
                data             : null,
            };
        });
    }
}