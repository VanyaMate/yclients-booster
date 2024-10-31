import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    DeleteManyCategoriesFormWidget,
} from '@/widget/categories/DeleteManyCategoriesFormWidget/DeleteManyCategoriesFormWidget.ts';


export class DeleteManyCategoriesButton extends Button {
    constructor () {
        super({
            innerHTML: 'Удалить множество',
            styleType: ButtonStyleType.DANGER,
        });

        this.element.addEventListener('click', this.showModal.bind(this));
    }

    showModal () {
        const categories = this.getAllCategories();
        const deleteForm = new DeleteManyCategoriesFormWidget({
            clientId: this.getClientId(),
        });
        deleteForm.setCategories(categories);
        const modal = new Modal({
            content: deleteForm,
            label  : 'Удаление категорий',
        });

        modal.show();
    }

    private getClientId () {
        return location.pathname.split('/')[3];
    }

    private getAllCategories () {
        const categories = [ ...document.querySelectorAll('.dd-item') ];
        return categories.map((category) => ({
            id   : category.getAttribute('data-id') ?? '-',
            title: category.textContent!.trim(),
        }));
    }
}