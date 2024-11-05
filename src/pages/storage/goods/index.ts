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

let clientId: string = '';

export const isGoodsPage = function (pathNameParts: Array<string>) {
    const isGoods = pathNameParts[1] === 'goods';
    clientId      = pathNameParts[3];
    return isGoods && clientId?.match(/\d+/);
};

export const goodsPageHandler = function () {
    startHandler(() => {
        const position = getCategoriesCreateButtonPlace() as Element;
        new Col({
            rows: [
                new CreateManyCategoriesButton(),
                new GetCategoriesIdsButton({ clientId: clientId }),
                new DeleteManyCategoriesButton(),
            ],
        }).insert(position, 'beforeend');
    });
};
