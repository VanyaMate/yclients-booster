import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    RemoveAllCardsForm,
} from '@/widget/tehnological_cards/RemoveAllCardsForm/RemoveAllCardsForm.ts';


export type RemoveCardInfo = {
    id: string;
    title: string;
}

export type RemoveAllCardsButtonProps = {
    clientId: string;
};

export class RemoveAllCardsModalButton extends ModalButton {
    constructor (props: RemoveAllCardsButtonProps) {
        const { clientId } = props;
        super({
            textContent: 'Удалить карточки',
            styleType  : ButtonStyleType.DANGER,
            modalProps : {
                content    : new RemoveAllCardsForm({ clientId }),
                label      : 'Удалить карточки',
                preferWidth: Modal.getPreferWidthByNesting(1),
            },
        });
    }
}