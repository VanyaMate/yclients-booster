import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getSettingsServicesRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServices/getSettingsServices.request-action.ts';
import { isNull } from '@vanyamate/types-kit';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import css from './SettingsServiceDescriptionUpdateForm.module.css';
import {
    SettingsServiceDescriptionUpdateAction,
} from '@/widget/settings/service/SettingsServiceDescriptionUpdateAction/SettingsServiceDescriptionUpdateAction.ts';


export type SettingsServiceDescriptionUpdateFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export type ServiceDescriptionUpdateItem = {
    id: string;
    descriptionBefore: string | null;
    descriptionAfter: string | null;
    data: SettingsServiceData | null;
}

export class SettingsServiceDescriptionUpdateForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger;
    private readonly _content: Col;

    constructor (props: SettingsServiceDescriptionUpdateFormProps) {
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
            placeholder: 'Формат Id/Описание',
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

    private _renderCompare (compareData: Array<ServiceDescriptionUpdateItem>) {
        const validItems: Array<ServiceDescriptionUpdateItem> = [];

        const nonValidTitle = new LabelDivider({
            textContent: 'Невалидные данные',
        });
        const nonValidTable = new Table({
            header: [ 'id', 'Описание' ],
        });

        const validTitle = new LabelDivider({
            textContent: 'Валидные данные',
        });
        const validTable = new Table({
            header: [ 'id', 'Описание (До)', 'Описание (После)' ],
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
                isNull(data.descriptionBefore) ||
                isNull(data.descriptionAfter) ||
                isNull(data.data)
            ) {
                nonValidTable.addRow([
                    data.id,
                    `${ data.descriptionAfter }`,
                ]);
            } else {
                validItems.push(data);
                validTable.addRow([
                    data.id,
                    data.descriptionBefore,
                    data.descriptionAfter,
                ]);
            }
        });

        this._content.add(nonValidTitle);
        this._content.add(nonValidTable);
        this._content.add(validTitle);
        this._content.add(validTable);
        this._content.add(startProcessButton);
    }

    private _renderProcess (services: Array<ServiceDescriptionUpdateItem>) {
        const progressBar   = new ProgressBar({ max: services.length });
        let success: number = 0;
        let error: number   = 0;

        const actionComponents = services.map((service) => {
            return new SettingsServiceDescriptionUpdateAction({
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

    private async _fillFormInput (services: Array<ServiceDescriptionUpdateItem>): Promise<Array<ServiceDescriptionUpdateItem>> {
        // Получить все услуги и заполнить информацию
        const allClientServices = await getSettingsServicesRequestAction(this._bearer, this._clientId, this._logger);

        for (let i = 0, clientService: SettingsServiceData | undefined = undefined, service: ServiceDescriptionUpdateItem | undefined = undefined; i < services.length; i++) {
            service       = services[i];
            clientService = allClientServices.data.find((clientService) => clientService.id.toString() === service.id);
            if (clientService) {
                service.descriptionBefore = clientService.comment;
                service.data              = clientService;
                service.data.comment      = service.descriptionAfter!;
            }
        }

        return services;
    }

    private _parseFormInput (input: string): Array<ServiceDescriptionUpdateItem> {
        const rows: Array<string> = input.split('\n');
        return rows.map((row) => {
            const [ id, description ] = row.split('\t');
            return {
                id,
                descriptionAfter : description,
                descriptionBefore: null,
                data             : null,
            };
        });
    }
}