import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    CreateManyGoodsCategoriesForm,
} from '@/widget/goods/list/CreateManyGoodsCategoriesForm/CreateManyGoodsCategoriesForm.ts';


export class CreateManyCategoriesButton extends Button {
    constructor () {
        super({
            innerHTML: 'Добавить много категорий',
            styleType: ButtonStyleType.PRIMARY,
            fullWidth: true,
        });

        const modal = new Modal({
            content: new CreateManyGoodsCategoriesForm({
                clientId: this.getClientId(),
            }),
            label  : 'Создание категорий',
        });

        this.element.addEventListener('click', () => modal.show());
    }

    private getClientId () {
        return location.pathname.split('/')[3];
    }
}