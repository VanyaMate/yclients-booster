import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SettingsServiceCategoriesCreateForm,
} from '@/widget/settings/service/SettingsServiceCategoriesCreateForm/SettingsServiceCategoriesCreateForm.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import {
    SettingsServiceMassivePriceUpdate,
} from '@/widget/settings/service/SettingsServiceMassivePriceUpdate/SettingsServiceMassivePriceUpdate.ts';


export const isSettingsServicePage = function (pathname: Array<string>) {
    console.log(pathname);
    return pathname[1] === 'settings' && pathname[2] === 'service_categories';
};

export const settingsServicePageHandler = function (pathname: Array<string>) {
    startHandler(async () => {
        const clientId: string = pathname[3];
        const bearer           = getBearerTokenDomAction();
        const container        = document.querySelector('#page-wrapper > .wrapper-content');

        if (container) {
            new Col({
                rows: [
                    new ModalButton({
                        textContent: 'Копировать сюда',
                        modalProps : {
                            content    : new SettingsServiceCategoriesCreateForm({
                                clientId,
                                bearer,
                            }),
                            preferWidth: 1000,
                            label      : 'Копирование услуг',
                        },
                    }),
                    new ModalButton({
                        textContent: 'Обновить цены',
                        modalProps : {
                            content    : new SettingsServiceMassivePriceUpdate({
                                clientId,
                                bearer,
                            }),
                            preferWidth: 700,
                            label      : 'Изменить цены',
                        },
                    }),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};