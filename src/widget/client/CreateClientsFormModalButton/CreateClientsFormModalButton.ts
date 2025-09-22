import { ButtonStyleType } from "@/shared/buttons/Button/Button";
import { ModalButton } from "@/shared/buttons/ModalButton/ModalButton";
import { CreateClientsForm } from "../CreateClientsForm/CreateClientsForm";

export type CreateClientsFormModalButtonProps = {
    clientId: string;
}

export class CreateClientsFormModalButton extends ModalButton {
    constructor(props: CreateClientsFormModalButtonProps) {
        const { clientId } = props;
        super({
            textContent: 'Массовое добавление',
            styleType: ButtonStyleType.PRIMARY,
            modalProps: {
                label: 'Массовое добавление клиентов',
                content: new CreateClientsForm({ clientId })
            }
        });
    }
}