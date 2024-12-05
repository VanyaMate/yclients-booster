import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SettingsServiceMassiveUpdatePriceButton,
} from '@/feature/SettingsServiceMassiveUpdatePriceButton/SettingsServiceMassiveUpdatePriceButton.ts';


export const isSettingsServicePage = function (pathname: Array<string>) {
    console.log(pathname);
    return pathname[1] === 'settings' && pathname[2] === 'service_categories';
};

export const settingsServicePageHandler = function (pathname: Array<string>) {
    startHandler(async () => {
        const clientId: string = pathname[3];
        const bearer           = getBearerTokenDomAction();
        const container        = document.querySelector('#page-wrapper > .wrapper-content');
        /*        const data1            = await getSalaryCriteriaListDataForCopyRequestAction(bearer, clientId, true, 5, 1);
         const data2            = await getSalaryCriteriaListDataForCopyRequestAction(bearer, clientId, true, 5, 1);*/

        if (container) {
            new Col({
                rows: [
                    /*                    new SettingsServiceCategoriesCompareComponent({
                     clientId,
                     clientData: data1.settingsCopyData,
                     targetData: data2.settingsCopyData,
                     bearer    : bearer,
                     fetcher   : new MemoFetch(),
                     }),*/
                    new SettingsServiceMassiveUpdatePriceButton({
                        clientId,
                        bearer,
                        textContent: 'Обновить цены',
                    }),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};