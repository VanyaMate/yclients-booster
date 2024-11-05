import {
    Button,
    ButtonStyleType,
} from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    GetGoodsCategoriesIdsTable,
} from '@/widget/goods/list/GetGoodsCategoriesIdsTable/GetGoodsCategoriesIdsTable.ts';


export type GetCategoriesIdsButtonProps = {
    clientId: string;
}

export class GetCategoriesIdsButton extends Button {
    private readonly _clientId: string                           = '';
    private _modal: Modal | null                        = null;
    private _content: GetGoodsCategoriesIdsTable | null = null;

    constructor (props: GetCategoriesIdsButtonProps) {
        super({
            innerHTML: 'Узнать все ID',
            styleType: ButtonStyleType.PRIMARY,
            fullWidth: true,
        });
        this._clientId = props.clientId;
        this.element.addEventListener('click', this.showIds.bind(this));
    }

    showIds () {
        if (!this._modal) {
            this._content = new GetGoodsCategoriesIdsTable({ clientId: this._clientId });
            this._modal   = new Modal({
                content: this._content,
                label  : 'IDs категорий',
            });
        }

        this._modal.show();
    }
}