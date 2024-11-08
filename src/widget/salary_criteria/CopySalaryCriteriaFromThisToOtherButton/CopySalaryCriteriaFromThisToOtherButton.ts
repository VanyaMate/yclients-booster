import { Button } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    CopySalaryCriteriaForm,
} from '@/widget/salary_criteria/CopySalaryCriteriaForm/CopySalaryCriteriaForm.ts';


export class CopySalaryCriteriaFromThisToOtherButton extends Button {
    private _modal: Modal | null = null;

    constructor (
        private readonly _clientId: string,
        private readonly _bearer: string,
    ) {
        super({
            innerHTML: 'Копировать критерии в другой филиал',
        });

        this.element.addEventListener('click', this._show.bind(this));
    }

    private _show () {
        if (!this._modal) {
            this._modal = new Modal({
                content: new CopySalaryCriteriaForm({
                    clientId: this._clientId,
                    bearer  : this._bearer,
                }),
                label  : 'Копирование критериев',
            });
        }

        this._modal.show();
    }
}