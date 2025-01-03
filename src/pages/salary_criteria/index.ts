import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SalaryCriteriaListInfo,
} from '@/widget/salary_criteria/SalaryCriteriaListInfo/SalaryCriteriaListInfo.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    SalaryCriteriaListCompareForm,
} from '@/widget/salary_criteria/SalaryCriteriaListCompareForm/SalaryCriteriaListCompareForm.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';


export const isSalaryCriteriaPage = function (pathnameParts: Array<string>): boolean {
    return pathnameParts[1] === 'salary_criteria' && !!pathnameParts[3].match(/\d+/);
};

export const salaryCriteriaPageHandler = function () {
    startHandler(() => {
        const container = document.querySelector('.wrapper-content');
        const clientId  = location.pathname.split('/')[3];
        const bearer    = getBearerTokenDomAction();

        if (container) {
            new Col({
                rows: [
                    new ModalButton({
                        textContent: 'Копировать сюда',
                        styleType  : ButtonStyleType.PRIMARY,
                        modalProps : {
                            content    : new SalaryCriteriaListCompareForm({
                                clientId, bearer,
                            }),
                            label      : 'Копирование критериев расчета ЗП',
                            preferWidth: 1100,
                        },
                    }),
                    new SalaryCriteriaListInfo(),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};