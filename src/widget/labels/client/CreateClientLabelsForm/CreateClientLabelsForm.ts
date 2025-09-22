import { createLabelClientRequestAction } from "@/action/labels/client/request-action/createLabelsClient/createLabelClient.request-action";
import { Logger } from "@/entity/logger/Logger/Logger";
import { getTableData } from "@/helper/lib/table/getTableData";
import { PromiseSplitter } from "@/service/PromiseSplitter/PromiseSplitter";
import { Col } from "@/shared/box/Col/Col";
import { Button, ButtonStyleType } from "@/shared/buttons/Button/Button";
import { Component, ComponentPropsOptional } from "@/shared/component/Component";
import { TextArea } from "@/shared/input/TextArea/TextArea";
import { ProgressBar } from "@/shared/progress/ProgressBar/ProgressBar";
import { Table } from "@/shared/table/Table/Table";

export type CreateClientLabelsFormProps = ComponentPropsOptional<HTMLDivElement> & {
    clientId: string;
}

export class CreateClientLabelsForm extends Component<HTMLDivElement> {
    private _clientId: string = '';
    private _logger: Logger = new Logger({});
    private _content: Col = new Col({ rows: [
        this._logger
    ] });
    
    constructor (props: CreateClientLabelsFormProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._content.insert(this.element, 'afterbegin');
        this._initForm(); 
    }

    private _initForm () {
        const input = new TextArea({
            placeholder: 'Формат Title Color Icon'
        })
        const compareButton = new Button({
            textContent: 'Получить данные',
            onclick: () => {
                this._renderCompareForm(getTableData(input.getValue()));
                input.remove();
                compareButton.remove();
            }
        })
        this._content.add(input);
        this._content.add(compareButton);
    }

    private _renderCompareForm (data: Array<Array<string>>) {
        const table = new Table({
            header: ['', 'Title', 'Color', 'Icon'],
        })
        const progress = new ProgressBar({
            max: 0
        });
        data.forEach((label) => table.addRow(['', ...label]));

        let success = 0;
        let errors = 0;
        progress.reset(data.length);

        const createButton = new Button({
            textContent: 'Создать',
            styleType: ButtonStyleType.PRIMARY,
            onclick: async () => {
                createButton.setLoading(true);
                createButton.element.textContent = 'Создание..';
                const promiseSplitter = new PromiseSplitter(5, 1);
                await promiseSplitter.exec(
                    data.map((label, index) => ({
                        chain: [
                            () => createLabelClientRequestAction(
                                this._clientId, 
                                {
                                    title: label[0],
                                    color: label[1],
                                    icon: label[2],
                                    entity: '1'
                                }, 
                                this._logger
                            )
                        ],
                        onError: () => {
                            errors += 1;
                            progress.setRightProgress(errors);
                        },
                        onSuccess: () => {
                            success += 1;
                            progress.setLeftProgress(success);
                            table.updateRow(index, ['+', ...label])
                        },
                    }))
                )
                createButton.setLoading(false);
                createButton.element.disabled = true;
                createButton.element.textContent = 'Создано';
            }
        })

        this._content.add(progress);
        this._content.add(createButton);
        this._content.add(table);
    }
}