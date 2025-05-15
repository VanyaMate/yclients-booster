import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    DeleteManyGoodsCategoriesForm,
} from '@/widget/goods/list/DeleteManyGoodsCategoriesForm/DeleteManyGoodsCategoriesForm.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';


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
                bearer  : this.getBearer(),
            });
            this._modal   = new Modal({
                content    : this._content,
                label      : 'Удаление категорий',
                preferWidth: Modal.getPreferWidthByNesting(3),
            });
        }

        this._modal.show();
    }

    private getClientId () {
        return location.pathname.split('/')[3];
    }

    private getBearer () {
        return getBearerTokenDomAction();
    }
}