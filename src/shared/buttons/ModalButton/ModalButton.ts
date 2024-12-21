import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import { Modal, ModalProps } from '@/shared/modal/Modal/Modal.ts';


export type ModalButtonProps =
    ButtonProps
    & {
        modalProps: ModalProps;
    };

export class ModalButton extends Button {
    private _modal: Modal | null = null;

    constructor (props: ModalButtonProps) {
        const { modalProps, ...other } = props;
        super(other);

        this.element.addEventListener('click', this._show.bind(this, modalProps));
    }

    private _show (modalProps: ModalProps) {
        if (this._modal) {
            this._modal.show();
            return;
        }

        this._modal = new Modal(modalProps);
        this._modal.show();
    }
}