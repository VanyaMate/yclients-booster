import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type CopyLabelsClientFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    };

export class CopyLabelsClientForm extends Component<HTMLDivElement> {
    private _logger: Logger;
    private _input: TextInput;
    private _confirmButton: Button;

    constructor (props: CopyLabelsClientFormProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this._logger = new Logger({});
        this._logger.insert(this.element, 'afterbegin');

        this._input         = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала откуда копировать',
        });
        this._confirmButton = new Button({
            styleType: ButtonStyleType.PRIMARY,
            innerHTML: 'Подтвердить',
            onclick  : this._onConfirmHandler.bind(this),
        });
    }

    private _onConfirmHandler () {
        if (this._input.getValue()) {
            // get
        }
    }
}