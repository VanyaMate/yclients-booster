import { Button } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    CreateCategoriesFormWidget,
} from '@/widget/categories/CreateCategoriesFormWidget/CreateCategoriesFormWidget.ts';


export class CreateManyCategoriesButton extends Button {
    constructor () {
        super({
            innerHTML: 'Добавить много категорий',
            isPrimary: true,
            fullWidth: true,
        });

        const modal = new Modal({
            content: new CreateCategoriesFormWidget({
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