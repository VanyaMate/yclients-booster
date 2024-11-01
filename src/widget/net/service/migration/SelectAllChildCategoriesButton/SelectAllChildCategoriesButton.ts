import {
    Button,
    ButtonSizeType,
    ButtonStyleType,
} from '@/shared/buttons/Button/Button.ts';


export class SelectAllChildCategoriesButton extends Button {
    constructor (private readonly _table: HTMLTableElement, private readonly _categoryId: string) {
        super({
            innerHTML: 'Выделить',
            styleType: ButtonStyleType.PRIMARY,
            size     : ButtonSizeType.SMALL,
        });

        this.element.addEventListener('click', this.selectAllParentCategories.bind(this));
    }

    private selectAllParentCategories () {
        this._table
            .querySelectorAll<HTMLInputElement>(`tr.service-row[data-category-id="${ this._categoryId }"] input[type=checkbox]`)
            .forEach((input) => {
                input.checked = true;
            });
    }
}