import { Button } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    CreateCategoriesFormWidget,
} from '@/widget/categories/CreateCategoriesFormWidget/CreateCategoriesFormWidget.ts';


const getCategoriesCreateButtonPlace = function () {
    return document.querySelector('#nestable')!.parentNode;
};

const openCategoriesCreateFormButton = function () {
    const modal  = new Modal({
        content: new CreateCategoriesFormWidget({
            clientId: '1092329',
        }),
        label  : 'Создание категорий',
    });
    const button = new Button({
        innerHTML: 'Добавить много категорий',
        isPrimary: true,
        fullWidth: true,
        onclick  : () => {
            modal.show();
        },
    });

    return button;
};

export const isGoodsPage = function (pathNameParts: Array<string>) {
    return pathNameParts[1] === 'goods' && pathNameParts[2] === 'list' && pathNameParts[3]?.match(/\d+/);
};

export const goodsPageHandler = function () {
    if (document.readyState === 'complete') {
        openCategoriesCreateFormButton().insert(getCategoriesCreateButtonPlace() as Element, 'beforeend');
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            openCategoriesCreateFormButton().insert(getCategoriesCreateButtonPlace() as Element, 'beforeend');
        });
    }
};
