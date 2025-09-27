import { createClientRequestAction, getDefaultCreateClientType } from "@/action/client/createClient.request-action";
import { getClientRequestAction } from "@/action/client/getClient.request-action";
import { getClientsWithPhoneRequestAction } from "@/action/client/getClientsWithPhone.request-action";
import { getCreateClientCustomPropsNoWindowRequestAction } from "@/action/client/getCreateClientCustomPropsNoWindow.request-action";
import { CustomPropData, DefaultPropData, getCreateClientCustomPropsWindowRequestAction, PropData } from "@/action/client/getCreateClientCustomPropsWindow.request-action";
import { ClientType } from "@/action/client/types/ClientType";
import { UpdateClientType } from "@/action/client/types/UpdateClientType";
import { updateClientRequestAction } from "@/action/client/updateClient.request-action";
import { Logger } from "@/entity/logger/Logger/Logger";
import { getTableData } from "@/helper/lib/table/getTableData";
import { IFetcher } from "@/service/Fetcher/Fetcher.interface";
import { MemoFetch } from "@/service/Fetcher/implementations/MemoFetch";
import { PromiseSplitter } from "@/service/PromiseSplitter/PromiseSplitter";
import { Col } from "@/shared/box/Col/Col";
import { Button, ButtonStyleType } from "@/shared/buttons/Button/Button";
import { Component, ComponentPropsOptional } from "@/shared/component/Component";
import { LabelDivider } from "@/shared/divider/LabelDivider/LabelDivider";
import { Dropdown } from "@/shared/dropdown/Dropdown/Dropdown";
import { CheckboxWithLabel } from "@/shared/input/CheckboxWithLabel/CheckboxWithLabel";
import { TextArea } from "@/shared/input/TextArea/TextArea";
import { ProgressBar } from "@/shared/progress/ProgressBar/ProgressBar";
import { Table } from "@/shared/table/Table/Table";


export type CreateClientsFormProps = ComponentPropsOptional<HTMLDivElement> & {
    bearer: string;
    clientId: string;
}

export class CreateClientsForm extends Component<HTMLDivElement> {
    private readonly _clientId: string = '';
    private readonly _bearer: string = '';
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col = new Col({ rows: [ this._logger ]});
    private readonly _fetcher: IFetcher = new MemoFetch();
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });

    constructor(props: CreateClientsFormProps) {
        const { clientId, bearer } = props;
        super('div', {});
        this._clientId = clientId;
        this._bearer = bearer;
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const clientsDataTextArea = new TextArea({
            placeholder: 'Введите данные',
            preferHeight: 600,
        });
        const parseButton = new Button({
            textContent: 'Начать сопоставление',
            onclick: async () => {
                parseButton.setLoading(true);
                parseButton.element.textContent = 'Получение данных..'
                const clientsData = getTableData(clientsDataTextArea.getValue());
                await this._renderComparisonForm(clientsData);
                parseButton.remove();
                clientsDataTextArea.remove();
            }
        })
        this._content.add(clientsDataTextArea);
        this._content.add(parseButton);
    }

    private async _renderComparisonForm (clientsData: Array<Array<string>>) {
        const windowCustomProps: Array<CustomPropData> = await getCreateClientCustomPropsWindowRequestAction(this._clientId, this._logger);
        const noWindowCustomProps: Array<CustomPropData> = await getCreateClientCustomPropsNoWindowRequestAction(this._clientId, this._logger);
        const defaultProps: Array<DefaultPropData> = this.getDefaultProps();
        const firstClientData = clientsData[0];
        const selectedProps: Array<PropData> = new Array();

        const comparisonTable = new Table({
            header: firstClientData.map((_, index) => {
                const dropdown = new Dropdown({
                    buttonProps: {
                        textContent: 'Выбрать',
                        fullWidth: true,
                    },
                    content: new Col({
                        // Хе-хе
                        rows: [
                            new LabelDivider({ textContent: 'Стандартные поля' }),
                            ...defaultProps.map((prop) => { 
                                const selectButton = new Button({
                                    textContent: prop.label,
                                    onclick: () => {
                                        dropdown.setTextButton(prop.label)
                                        selectedProps[index] = prop;
                                        if (firstClientData.every((_, index) => !!selectedProps[index])) {
                                            confirmDataButton.setStyleType(ButtonStyleType.PRIMARY);
                                            confirmDataButton.element.disabled = false;
                                            confirmDataButton.element.textContent = 'Подтвердить';
                                        } else {
                                            confirmDataButton.element.disabled = true;
                                            confirmDataButton.element.textContent = 'Выберите все поля';
                                        }
                                    }
                                })
                                return selectButton;
                            }),
                            new LabelDivider({ textContent: 'Кастомные поля' }),
                            ...windowCustomProps.map((prop) => { 
                                const selectButton = new Button({
                                    textContent: prop.label,
                                    onclick: () => {
                                        dropdown.setTextButton(prop.label)
                                        selectedProps[index] = prop;
                                        if (firstClientData.every((_, index) => !!selectedProps[index])) {
                                            confirmDataButton.setStyleType(ButtonStyleType.PRIMARY);
                                            confirmDataButton.element.disabled = false;
                                            confirmDataButton.element.textContent = 'Подтвердить';
                                        } else {
                                            confirmDataButton.element.disabled = true;
                                            confirmDataButton.element.textContent = 'Выберите все поля';
                                        }
                                    }
                                })
                                return selectButton;
                            }),
                            new LabelDivider({ textContent: 'Дополнительные поля' }),
                            ...noWindowCustomProps.map((prop) => { 
                                const selectButton = new Button({
                                    textContent: prop.label,
                                    onclick: () => {
                                        dropdown.setTextButton(prop.label)
                                        selectedProps[index] = prop;
                                        if (firstClientData.every((_, index) => !!selectedProps[index])) {
                                            confirmDataButton.setStyleType(ButtonStyleType.PRIMARY);
                                            confirmDataButton.element.disabled = false;
                                            confirmDataButton.element.textContent = 'Подтвердить';
                                        } else {
                                            confirmDataButton.element.disabled = true;
                                            confirmDataButton.element.textContent = 'Выберите все поля';
                                        }
                                    }
                                })
                                return selectButton;
                            }),
                        ]
                    })
                });
                return dropdown;
            })
        })

        clientsData.slice(0, 20).forEach((clientData) => {
            comparisonTable.addRow(clientData);
        })

        const confirmDataButton = new Button({
            textContent: 'Выберите все поля',
            disabled: true,
            onclick: async () => {
                confirmDataButton.setLoading(true);
                confirmDataButton.setText("Получение списка телефонов");
                await this._renderConfirmForm(clientsData, selectedProps);
                comparisonTable.remove();
                confirmDataButton.remove();
            }
        })

        this._content.add(comparisonTable);
        this._content.add(confirmDataButton);
    }

    private async _renderConfirmForm (clientData: Array<Array<string>>, selectedProps: Array<PropData>) {
        const clientsWithPhone = await getClientsWithPhoneRequestAction(this._bearer, this._clientId, this._logger);
        const existedClients: Array<Array<string>> = [];
        const notExistedClients: Array<Array<string>> = [];
        const existedPhones: Record<string, number> = {};
        const phonePropIndex: number = selectedProps.findIndex((prop) => prop.name === 'phone');

        clientsWithPhone.forEach((client) => {
            const phoneMatch = client.phone.match(/\d+/);
            if (phoneMatch) {
                existedPhones[phoneMatch[0]] = client.id;
            }
        });

        clientData.forEach((client) => {
            if (existedPhones[client[phonePropIndex]?.trim()]) {
                existedClients.push(client);
            } else {
                notExistedClients.push(client);
            }
        })

        const notExistedClientsDivider = new LabelDivider({
            textContent: 'Список клиентов для создания',
        })
        const notExistedClientsTable = new Table({
            header: ['', ...selectedProps.map((prop) => prop.label)],
        })
        notExistedClients.forEach((data) => {
            notExistedClientsTable.addRow(['', ...data]);
        })

        const existedClientsDivider = new LabelDivider({
            textContent: 'Список клиентов для обновления',
        })
        const existedClientsTable = new Table({
            header: ['', ...selectedProps.map((prop) => prop.label)],
        })
        existedClients.forEach((data) => {
            existedClientsTable.addRow(['', ...data]);
        })

        const updateExistedClientsCheckbox = new CheckboxWithLabel({
            label: 'Обновить клиентов',
            checked: false,
        })


        this._progressBar.reset(clientData.length);
        let success = 0;
        let errors = 0;

        const confirmButton = new Button({
            textContent: 'Создать',
            onclick: async () => {
                confirmButton.setLoading(true);
                const promiseSplitter = new PromiseSplitter(5, 1);
                await promiseSplitter.exec(notExistedClients.map((client, index) => {
                    const createClientData = getDefaultCreateClientType();
                    selectedProps.forEach((prop, index) => {
                        createClientData[prop.name] = client[index];
                        if (prop.isCustom) {
                            createClientData[`custom_fields[${prop.name}]`] = client[index];
                        }
                    });
                    
                    return {
                        chain: [
                            () => createClientRequestAction(this._clientId, createClientData, this._fetcher, this._logger),
                            async () => notExistedClientsTable.updateRow(index, ['+', ...client]),
                        ],
                        onError: () => {
                            this._progressBar.setRightProgress(++errors);
                        },
                        onSuccess: () => {
                            this._progressBar.setLeftProgress(++success);
                        }
                    }
                }));

                if (updateExistedClientsCheckbox.getState()) {
                    await promiseSplitter.exec(existedClients.map((clientInput, index) => {
                        const clientId: string = existedPhones[clientInput[phonePropIndex]].toString();
                        return {
                            chain: [
                                () => getClientRequestAction(clientId, this._logger),
                                (clientData: ClientType) => updateClientRequestAction(
                                    this.getUpdateClientDefaultType(clientId, clientInput, selectedProps, clientData), 
                                    this._fetcher, 
                                    this._logger
                                ),
                                async () => existedClientsTable.updateRow(index, ['+', ...clientInput]),
                            ],
                            onError: () => {
                                this._progressBar.setRightProgress(++errors);
                            },
                            onSuccess: () => {
                                this._progressBar.setLeftProgress(++success);
                            }
                        }
                    }));
                }

                confirmButton.setLoading(false);
                confirmButton.setDisable(true);
                confirmButton.setText('Завершено');
            }
        })

        this._content.add(this._progressBar);
        this._content.add(notExistedClientsDivider);
        this._content.add(notExistedClientsTable);
        this._content.add(existedClientsDivider);
        this._content.add(existedClientsTable);
        this._content.add(updateExistedClientsCheckbox);
        this._content.add(confirmButton);
    }

    private getUpdateClientDefaultType (clientId: string, clientInput: Array<string>, selectedProps: Array<PropData>, clientType: ClientType): UpdateClientType {
        const updateData = {
            client_id: clientId,
            fullname: clientInput[selectedProps.findIndex((prop) => prop.name === 'fullname')] ?? clientType.name,
            patronymic: clientInput[selectedProps.findIndex((prop) => prop.name === 'patronymic')] ?? clientType.patronymic,
            surname: clientInput[selectedProps.findIndex((prop) => prop.name === 'surname')] ?? clientType.surname,
            phone: clientInput[selectedProps.findIndex((prop) => prop.name === 'phone')] ?? clientType.phone,
            additional_phone: clientInput[selectedProps.findIndex((prop) => prop.name === 'additional_phone')] ?? clientType.additional_phone,
            email: clientInput[selectedProps.findIndex((prop) => prop.name === 'email')] ?? clientType.email,
            'labels[]': clientInput[selectedProps.findIndex((prop) => prop.name === 'labels[]')] ?? (clientType.labels ?? []).join(','),
            sex: clientInput[selectedProps.findIndex((prop) => prop.name === 'sex')] ?? clientType.sex,
            importance: clientInput[selectedProps.findIndex((prop) => prop.name === 'importance')] ?? clientType.importance,
            discount: clientInput[selectedProps.findIndex((prop) => prop.name === 'discount')] ?? clientType.discount,
            card: clientInput[selectedProps.findIndex((prop) => prop.name === 'card')] ?? clientType.card,
            bd_day: clientInput[selectedProps.findIndex((prop) => prop.name === 'bd_day')] ?? clientType.bd_day,
            bd_month: clientInput[selectedProps.findIndex((prop) => prop.name === 'bd_month')] ?? clientType.bd_month,
            bd_year: clientInput[selectedProps.findIndex((prop) => prop.name === 'bd_year')] ?? clientType.bd_year,
            comment: clientInput[selectedProps.findIndex((prop) => prop.name === 'comment')] ?? clientType.comment,
            edit_spent: 0,
            spent: clientType.money,
            edit_paid: 0,
            paid: clientType.paid_money,
            balance: clientInput[selectedProps.findIndex((prop) => prop.name === 'balance')] ?? clientType.balance,
            image: '',
            text: '',
            is_personal_data_processing_allowed: clientType.client_agreements?.is_personal_data_processing_allowed ? 1 : 0,
            is_newsletter_allowed: clientType.client_agreements?.is_newsletter_allowed ? 1 : 0,
        } as UpdateClientType;

        selectedProps.forEach((prop, index) => {
            if (prop.isCustom) {
                updateData[`custom_fields[${prop.name}]`] = clientInput[index];
            }
        });

        return updateData;
    }

    private getDefaultProps (): Array<DefaultPropData> {
        return [
            {
                "label": "Имя",
                "name": "fullname",
                "isCustom": false
            },
            {
                "label": "Отчество",
                "name": "patronymic",
                "isCustom": false
            },
            {
                "label": "Фамилия",
                "name": "surname",
                "isCustom": false
            },
            {
                "label": "Сотовый",
                "name": "phone",
                "isCustom": false
            },
            {
                "label": "Дополнительный телефон",
                "name": "additional_phone",
                "isCustom": false
            },
            {
                "label": "E-mail",
                "name": "email",
                "isCustom": false
            },
            {
                "label": "Категория",
                "name": "labels[]",
                "isCustom": false
            },
            {
                "label": "Пол",
                "name": "sex",
                "isCustom": false
            },
            {
                "label": "Важность",
                "name": "importance",
                "isCustom": false
            },
            {
                "label": "Скидка",
                "name": "discount",
                "isCustom": false
            },
            {
                "label": "Номер карты",
                "name": "card",
                "isCustom": false
            },
            {
                "label": "Дата рождения",
                "name": "bd_day",
                "isCustom": false
            },
            {
                "label": "Комментарий",
                "name": "comment",
                "isCustom": false
            },
            {
                "label": "Продано",
                "name": "money",
                "isCustom": false
            },
            {
                "label": "Оплачено",
                "name": "paid_money",
                "isCustom": false
            },
        ]
    }
}