import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    SettingsServiceMassivePriceUpdate,
} from '@/widget/settings/service/SettingsServiceMassivePriceUpdate/SettingsServiceMassivePriceUpdate.ts';


export type SettingsServiceMassiveUpdatePriceButtonProps =
    ButtonProps
    & {
        clientId: string;
        bearer: string;
    };

export class SettingsServiceMassiveUpdatePriceButton extends Button {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private _modal?: Modal;

    constructor (props: SettingsServiceMassiveUpdatePriceButtonProps) {
        const { clientId, bearer, ...other } = props;
        super(other);
        this._clientId = clientId;
        this._bearer   = bearer;
        this.element.addEventListener('click', this._show.bind(this));
    }

    private _show () {
        if (!this._modal) {
            this._modal = new Modal({
                label  : 'Изменить цены',
                content: new SettingsServiceMassivePriceUpdate({
                    clientId: this._clientId, bearer: this._bearer,
                }),
            });
        }

        this._modal.show();
    }
}