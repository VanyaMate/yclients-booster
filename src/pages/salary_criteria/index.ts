import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    CopySalaryCriteriaFromThisToOtherButton,
} from '@/widget/salary_criteria/CopySalaryCriteriaFromThisToOtherButton/CopySalaryCriteriaFromThisToOtherButton.ts';
import {
    SalaryCriteriaListInfo,
} from '@/widget/salary_criteria/SalaryCriteriaListInfo/SalaryCriteriaListInfo.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';


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
                    new CopySalaryCriteriaFromThisToOtherButton(clientId, bearer),
                    new SalaryCriteriaListInfo(),
                    new CompareHeaderV3({
                        headerOriginal: 'Original',
                        label         : 'Original',
                        headerCompare : 'Original',
                    }),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};