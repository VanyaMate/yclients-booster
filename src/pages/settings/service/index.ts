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
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    SettingsServiceOnlineTitleUpdateForm,
} from '@/widget/settings/service/SettingsServiceOnlineTitleUpdateForm/SettingsServiceOnlineTitleUpdateForm.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    SettingsServiceMassRemove
} from '@/widget/settings/service/SettingsServiceMassActions/SettingsServiceMassRemove.ts';


export const isSettingsServicePage = function (pathname: Array<string>) {
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
                            preferWidth: Modal.getPreferWidthByNesting(5),
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
                            preferWidth: Modal.getPreferWidthByNesting(1),
                            label      : 'Изменить цены',
                        },
                    }),
                    new ModalButton({
                        textContent: 'Обновить чек и оз',
                        modalProps : {
                            content    : new SettingsServiceOnlineTitleUpdateForm({
                                clientId,
                                bearer,
                            }),
                            preferWidth: Modal.getPreferWidthByNesting(1),
                            label      : 'Изменить чек и оз',
                        },
                    }),
                    new ModalButton({
                        textContent: 'Массовое удаление',
                        styleType  : ButtonStyleType.DANGER,
                        modalProps : {
                            content    : new SettingsServiceMassRemove({
                                clientId,
                                bearer,
                            }),
                            preferWidth: Modal.getPreferWidthByNesting(1),
                            label      : 'Массовое удаление',
                        },
                    }),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};