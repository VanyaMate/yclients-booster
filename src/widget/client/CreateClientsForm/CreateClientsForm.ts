import { getCreateClientCustomPropsNoWindowRequestAction } from "@/action/client/getCreateClientCustomPropsNoWindow.request-action";
import { getCreateClientCustomPropsWindowRequestAction } from "@/action/client/getCreateClientCustomPropsWindow.request-action";
import { Logger } from "@/entity/logger/Logger/Logger";
import { Col } from "@/shared/box/Col/Col";
import { Button } from "@/shared/buttons/Button/Button";
import { Component, ComponentPropsOptional } from "@/shared/component/Component";


export type CreateClientsFormProps = ComponentPropsOptional<HTMLDivElement> & {
    clientId: string;
}

export class CreateClientsForm extends Component<HTMLDivElement> {
    private readonly _clientId: string = '';
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col = new Col({ rows: [ this._logger ]});

    constructor(props: CreateClientsFormProps) {
        const { clientId } = props;
        super('div', {});
        this._clientId = clientId;
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const button = new Button({
            textContent: 'Получить форму',
            onclick: () => {
                getCreateClientCustomPropsWindowRequestAction(this._clientId).then((form) => console.log(form));
                getCreateClientCustomPropsNoWindowRequestAction(this._clientId).then((form) => console.log(form));
            }
        })
        this._content.add(button);
    }
}