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
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import {
    ChangeManyGoodsCategory,
} from '@/widget/goods/list/ChangeManyGoodsCategory/ChangeManyGoodsCategory.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    GoodCategoriesCompareForm,
} from '@/widget/goods/list/GoodCategoriesCompareForm/GoodCategoriesCompareForm.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


const getCategoriesCreateButtonPlace = function () {
    return document.querySelector('#nestable')?.parentNode as Element;
};

const getGoodsActionButtonPlace = function (): Element {
    return document.querySelector(`#page-wrapper .wrapper-content .ibox .ibox-content.menu`) as Element;
};

let clientId: string = '';

export const isGoodsPage = function (pathNameParts: Array<string>) {
    const isGoods = pathNameParts[1] === 'goods';
    clientId      = pathNameParts[3];
    return isGoods && clientId?.match(/\d+/);
};


export const goodsPageHandler = function () {
    startHandler(() => {
        const position        = getCategoriesCreateButtonPlace();
        const actionsPosition = getGoodsActionButtonPlace();
        const bearer          = getBearerTokenDomAction();

        if (position) {
            new Col({
                rows: [
                    new LabelDivider({ textContent: 'Действия с категориями' }),
                    new CreateManyCategoriesButton(),
                    new GetCategoriesIdsButton({ clientId: clientId }),
                    new DeleteManyCategoriesButton(),
                    new ModalButton({
                        textContent: 'Копировать категории',
                        styleType  : ButtonStyleType.PRIMARY,
                        modalProps : {
                            label      : 'Копировать категории из',
                            preferWidth: Modal.getPreferWidthByNesting(3),
                            content    : new GoodCategoriesCompareForm({
                                clientId: clientId,
                                bearer  : bearer,
                            }),
                        },
                    }),
                ],
            }).insert(position, 'beforeend');
        }

        if (actionsPosition) {
            new Col({
                rows: [
                    new LabelDivider({ textContent: 'Действия с товарами' }),
                    new ModalButton({
                        textContent: 'Перенести выбранные',
                        styleType  : ButtonStyleType.PRIMARY,
                        modalProps : {
                            content    : new ChangeManyGoodsCategory({
                                clientId,
                                bearer,
                            }),
                            label      : 'Выбор новой категории',
                            preferWidth: Modal.getPreferWidthByNesting(1),
                        },
                    }),
                ],
            }).insert(actionsPosition, 'beforeend');
        }
    });
};
