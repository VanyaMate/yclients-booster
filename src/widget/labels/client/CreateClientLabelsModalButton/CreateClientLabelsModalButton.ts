import { ModalButton } from "@/shared/buttons/ModalButton/ModalButton";
import { CreateClientLabelsForm } from "../CreateClientLabelsForm/CreateClientLabelsForm";
import { Modal } from "@/shared/modal/Modal/Modal";

export type CreateClientLabelsModalButtonProps = {
    clientId: string;
}

export class CreateClientLabelsModalButton extends ModalButton {
    constructor (props: CreateClientLabelsModalButtonProps) {
        const { clientId } = props;
        super({
            textContent: 'Создать категории',
            modalProps: {
                content: new CreateClientLabelsForm({ clientId }),
                label: 'Создание категорий клиента',
                preferWidth: Modal.getPreferWidthByNesting(2),
            }
        });
    }
}