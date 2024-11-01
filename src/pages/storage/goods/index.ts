import {
    CreateManyCategoriesButton,
} from '@/widget/categories/CreateManyCategoriesButton/CreateManyCategoriesButton.ts';
import {
    GetCategoriesIdsButton,
} from '@/widget/categories/GetCategoriesIdsButton/GetCategoriesIdsButton.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    DeleteManyCategoriesButton,
} from '@/widget/categories/DeleteManyCategoriesButton/DeleteManyCategoriesButton.ts';
import { startHandler } from '@/shared/lib/startHandler.ts';


const getCategoriesCreateButtonPlace = function () {
    return document.querySelector('#nestable')!.parentNode;
};

export const isGoodsPage = function (pathNameParts: Array<string>) {
    return pathNameParts[1] === 'goods' && pathNameParts[3]?.match(/\d+/);
};

export const goodsPageHandler = function () {
    startHandler(() => {
        const position = getCategoriesCreateButtonPlace() as Element;
        new Col({
            rows: [
                new CreateManyCategoriesButton(),
                new GetCategoriesIdsButton(),
                new DeleteManyCategoriesButton(),
            ],
        }).insert(position, 'beforeend');
    });
};
