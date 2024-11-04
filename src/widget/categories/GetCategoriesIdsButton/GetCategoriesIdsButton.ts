import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import {
    getGoodsCategoriesDomAction,
} from '@/action/goods/list/dom-actions/getGoodsCategories.dom-action.ts';


export class GetCategoriesIdsButton extends Button {
    constructor () {
        super({
            innerHTML: 'Узнать все ID',
            styleType: ButtonStyleType.PRIMARY,
            fullWidth: true,
        });

        this.element.addEventListener('click', this.showIds.bind(this));
    }

    showIds () {
        const categories = getGoodsCategoriesDomAction();
        const table      = new Table({ header: [ 'title', 'id' ] });
        const modal      = new Modal({
            content: table,
            label  : 'IDs категорий',
        });

        categories.forEach((category) => table.addRow([ category.title, category.id ]));
        modal.show();
    }
}