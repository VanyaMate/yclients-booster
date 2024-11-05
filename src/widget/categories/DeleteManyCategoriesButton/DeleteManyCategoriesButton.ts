import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    DeleteManyGoodsCategoriesForm,
} from '@/widget/goods/list/DeleteManyGoodsCategoriesForm/DeleteManyGoodsCategoriesForm.ts';


export class DeleteManyCategoriesButton extends Button {
    private _modal: Modal | null                           = null;
    private _content: DeleteManyGoodsCategoriesForm | null = null;

    constructor () {
        super({
            innerHTML: 'Удалить множество',
            styleType: ButtonStyleType.DANGER,
        });

        this.element.addEventListener('click', this.showModal.bind(this));
    }

    showModal () {
        if (!this._modal) {
            this._content = new DeleteManyGoodsCategoriesForm({
                clientId: this.getClientId(),
            });
            this._modal   = new Modal({
                content: this._content,
                label  : 'Удаление категорий',
            });
        }

        this._modal.show();
    }

    private getClientId () {
        return location.pathname.split('/')[3];
    }
}