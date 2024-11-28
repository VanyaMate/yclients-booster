import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { startHandler } from '@/shared/lib/startHandler.ts';
import {
    SettingsServiceCategoriesCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoriesCompareComponent/SettingsServiceCategoriesCompareComponent.ts';
import {
    getSalaryCriteriaListDataForCopyRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaListDataForCopy/getSalaryCriteriaListDataForCopy.request-action.ts';


export const isSettingsServicePage = function (pathname: Array<string>) {
    return pathname[1] === 'settings' && pathname[2] === 'service_categories';
};

export const settingsServicePageHandler = function (pathname: Array<string>) {
    startHandler(async () => {
        const clientId: string = pathname[3];
        const bearer           = getBearerTokenDomAction();
        const container        = document.querySelector('#page-wrapper > .wrapper-content');
        const data             = await getSalaryCriteriaListDataForCopyRequestAction(bearer, clientId, true, 5, 1);

        console.log('container', container);

        if (container) {
            new SettingsServiceCategoriesCompareComponent({
                clientId,
                clientData : data.settingsCopyData,
                compareData: data.settingsCopyData,
            }).insert(container, 'afterbegin');
        }
    });
};