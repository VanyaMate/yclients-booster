import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import {
    SettingsFilialStuffCreateModal,
} from '@/widget/settings/filial_stuff/SettingsFilialStuffCreateModal/SettingsFilialStuffCreateModal.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';


export const isSettingsFilialStuffPage = function (pathname: Array<string>) {
    return pathname[1] === 'settings' && pathname[2] === 'filial_staff' && pathname[3].match(/\d+/);
};

export const settingsFilialStuffPageHandler = function (pathname: Array<string>) {
    startHandler(() => {
        const clientId: string = pathname[3];
        const bearer: string   = getBearerTokenDomAction();
        const container        = document.querySelector(`#page-wrapper .page-heading .page-heading-content`);

        if (container) {
            new Col({
                rows: [
                    new ModalButton({
                        styleType  : ButtonStyleType.PRIMARY,
                        textContent: 'Действия',
                        modalProps : {
                            label  : 'Дополнительные действия',
                            content: new Col({
                                rows: [
                                    new SettingsFilialStuffCreateModal({
                                        clientId,
                                        bearer,
                                    }),
                                ],
                            }),
                        },
                    }),
                ],
            })
                .insert(container, 'beforeend');
        }
    });
};