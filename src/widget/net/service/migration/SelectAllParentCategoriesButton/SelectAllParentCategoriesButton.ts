import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export class SelectAllParentCategoriesButton extends Button {
    constructor (private readonly _table: HTMLTableElement) {
        super({
            innerHTML: 'Выделить все категории',
            styleType: ButtonStyleType.PRIMARY,
        });

        this.element.addEventListener('click', this.selectAllParentCategories.bind(this));
    }

    private selectAllParentCategories () {
        this._table
            .querySelectorAll<HTMLInputElement>(`tr:not(.service-row) input[type=checkbox]`)
            .forEach((input) => {
                input.checked = true;
            });
    }
}