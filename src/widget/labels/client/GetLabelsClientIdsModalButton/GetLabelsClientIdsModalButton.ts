import { ButtonStyleType } from "@/shared/buttons/Button/Button";
import { ModalButton } from "@/shared/buttons/ModalButton/ModalButton";
import { GetLabelsClientIdsForm } from "../GetLabelsClientIdsForm/GetLabelsClientIdsForm";
import { Modal } from "@/shared/modal/Modal/Modal";

export type GetLabelsClientIdsModalButtonProps = {
    clientId: string;
}

export class GetLabelsClientIdsModalButton extends ModalButton {
    constructor (props: GetLabelsClientIdsModalButtonProps) {
        const { clientId } = props;
    
        super({
            textContent: 'Получить ID-шники',
            styleType: ButtonStyleType.DEFAULT,
            modalProps: {
                content: new GetLabelsClientIdsForm({ clientId }),
                label: 'Список ID-шников',
                preferWidth: Modal.getPreferWidthByNesting(2),
            }
        })
    }
}