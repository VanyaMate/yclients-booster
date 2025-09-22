import { getLabelsClientRequestAction } from "@/action/labels/client/request-action/getLabelsClient/getLabelsClient.request-action";
import { Logger } from "@/entity/logger/Logger/Logger";
import { Col } from "@/shared/box/Col/Col";
import { Button, ButtonStyleType } from "@/shared/buttons/Button/Button";
import { Component, ComponentPropsOptional } from "@/shared/component/Component";
import { Table } from "@/shared/table/Table/Table";

export type GetLabelsClientIdsFormProps = ComponentPropsOptional<HTMLDivElement> & {
    clientId: string;
};

export class GetLabelsClientIdsForm extends Component<HTMLDivElement> {
    private _clientId: string = '';
    private _logger: Logger = new Logger({});
    private _content: Col = new Col({ rows: [
        this._logger
    ]});

    constructor (props: GetLabelsClientIdsFormProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._content.insert(this.element, 'afterbegin');
        this._initForm();
    }

    private _initForm () {
        const getIdsButton = new Button({
            textContent: 'Получить ID-шники',
            styleType: ButtonStyleType.PRIMARY,
            onclick: async () => {
                getIdsButton.setLoading(true);
                getIdsButton.element.textContent = 'Получение ID-шников..';

                // get ids
                const data = await getLabelsClientRequestAction(this._clientId, this._logger);

                // render table
                const table = new Table({
                    header: ['ID', 'Title', 'Color', 'Entity', 'Icon']
                })
                data.forEach((label) => table.addRow([
                    label.id,   
                    label.title,
                    label.color,
                    label.entity,
                    label.icon
                ]))
                this._content.add(table);

                // remove button
                getIdsButton.remove();
            }
        })

        this._content.add(getIdsButton);
    }
}