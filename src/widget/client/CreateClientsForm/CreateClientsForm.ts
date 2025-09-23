import { createClientRequestAction, getDefaultCreateClientType } from "@/action/client/createClient.request-action";
import { getCreateClientCustomPropsNoWindowRequestAction } from "@/action/client/getCreateClientCustomPropsNoWindow.request-action";
import { CustomPropData, DefaultPropData, getCreateClientCustomPropsWindowRequestAction, PropData } from "@/action/client/getCreateClientCustomPropsWindow.request-action";
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
import { TextArea } from "@/shared/input/TextArea/TextArea";
import { Table } from "@/shared/table/Table/Table";


export type CreateClientsFormProps = ComponentPropsOptional<HTMLDivElement> & {
    clientId: string;
}

export class CreateClientsForm extends Component<HTMLDivElement> {
    private readonly _clientId: string = '';
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col = new Col({ rows: [ this._logger ]});
    private readonly _fetcher: IFetcher = new MemoFetch();

    constructor(props: CreateClientsFormProps) {
        const { clientId } = props;
        super('div', {});
        this._clientId = clientId;
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const clientsDataTextArea = new TextArea({
            placeholder: 'Введите данные',
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
            onclick: () => {
                this._renderConfirmForm(clientsData, selectedProps);
                comparisonTable.remove();
                confirmDataButton.remove();
            }
        })

        this._content.add(comparisonTable);
        this._content.add(confirmDataButton);
    }

    private _renderConfirmForm (clientData: Array<Array<string>>, selectedProps: Array<PropData>) {
        const confirmTable = new Table({
            header: ['', ...selectedProps.map((prop) => prop.label)],
        })
        clientData.forEach((data) => {
            confirmTable.addRow(['', ...data]);
        })
        const confirmButton = new Button({
            textContent: 'Создать',
            onclick: async () => {
                confirmButton.setLoading(true);
                
                const promiseSplitter = new PromiseSplitter(5, 1);

                await promiseSplitter.exec(clientData.map((data, index) => {
                    const createClientData = getDefaultCreateClientType();
                    selectedProps.forEach((prop, index) => {
                        createClientData[prop.name] = data[index];
                        if (prop.isCustom) {
                            createClientData[`custom_fields[${prop.name}]`] = data[index];
                        }
                    });
                    
                    return {
                        chain: [
                            () => createClientRequestAction(this._clientId, createClientData, this._fetcher, this._logger),
                            async () => confirmTable.updateRow(index, ['+', ...data]),
                        ]
                    }
                }));

                confirmButton.setLoading(false);
                confirmButton.setDisable(true);
                confirmButton.setText('Завершено');
            }
        })

        this._content.add(confirmTable);
        this._content.add(confirmButton);
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