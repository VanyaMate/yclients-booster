import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    GroupLoyaltyCertificateMassAddForm,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateMassAddForm/GroupLoyaltyCertificateMassAddForm.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    AddSalonIdWithSettingsToLoyaltyCertificate,
} from '@/widget/net/group_loyalty_certificate/AddSalonIdWithSettingsToLoyaltyCertificate/AddSalonIdWithSettingsToLoyaltyCertificate.ts';
import {
    AddSalonIdToLoyaltyCertificate,
} from '@/widget/net/group_loyalty_certificate/AddSalonIdToLoyaltyCertificate/AddSalonIdToLoyaltyCertificate.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';

// 1092329
// 557451

let clientId: string = '';

export const isGroupLoyaltyCertificate = function (paths: Array<string>): boolean {
    clientId = paths[2];
    return paths[1] === 'group_loyalty_certificate_types';
};

export const groupLoyaltyCertificate = function () {
    startHandler(() => {
        const bearer                = getBearerTokenDomAction();
        const validClientId: number = Number(clientId);
        if (validClientId !== 0 && !isNaN(validClientId)) {
            const container    = document.querySelector(`#page-wrapper > .wrapper-content > .ibox`);
            const newContainer = document.querySelector('#loyalty-certificate-type-app-wrapper');

            if (container || newContainer) {
                new Col({
                    rows: [
                        new ModalButton({
                            textContent: 'Добавить множество сертификатов',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new GroupLoyaltyCertificateMassAddForm({
                                    clientId,
                                }),
                                label      : 'Добавить множество сертификатов',
                                preferWidth: 700,
                            },
                        }),
                        new ModalButton({
                            textContent: 'Установить филиал везде где',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new AddSalonIdWithSettingsToLoyaltyCertificate({
                                    clientId,
                                    bearer,
                                }),
                                label      : `Добавить филиал ко всем сертификатам`,
                                preferWidth: Modal.getPreferWidthByNesting(1),
                            },
                        }),
                        new ModalButton({
                            textContent: 'Установить филиал везде',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new AddSalonIdToLoyaltyCertificate({
                                    clientId,
                                    bearer,
                                }),
                                label      : 'Добавить филиал ко всем сертификатам',
                                preferWidth: Modal.getPreferWidthByNesting(1),
                            },
                        }),
                    ],
                }).insert(container || newContainer!, 'beforebegin');
            }
        }
    });
};