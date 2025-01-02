import {
    Button,
    ButtonProps,
    ButtonStyleType,
} from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    CopyLabelsClientForm
} from '@/widget/labels/client/CopyLabelsClientForm/CopyLabelsClientForm.ts';


export type CopyLabelsClientButtonProps =
    ButtonProps
    & {
        clientId: string;
    };

export class CopyLabelsClientButton extends Button {
    constructor (props: CopyLabelsClientButtonProps) {
        const { clientId, ...other } = props;
        const modal                  = new Modal({
            content: new CopyLabelsClientForm({ clientId }),
            label  : 'Копировать сюда из',
        });
        super({
            ...other,
            innerHTML: 'Копировать сюда',
            styleType: ButtonStyleType.PRIMARY,
            onclick  : modal.show.bind(modal),
        });
    }
}