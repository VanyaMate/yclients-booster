import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    GroupLoyaltyAbonementMassAddForm,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/GroupLoyaltyAbonementMassAddForm.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    AddSalonIdGroupLoyaltyAbonementForm,
} from '@/widget/net/group_loyalty_abonement/AddSalonIdGroupLoyaltyAbonement/AddSalonIdGroupLoyaltyAbonementForm.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    AddSalonIdWithSettingsGroupLoyaltyAbonement,
} from '@/widget/net/group_loyalty_abonement/AddSalonIdWithSettingsGroupLoyaltyAbonement/AddSalonIdWithSettingsGroupLoyaltyAbonement.ts';


let clientId: string = '';

export const isGroupLoyaltyAbonement = function (paths: Array<string>): boolean {
    clientId = paths[2];
    return paths[1] === 'group_loyalty_abonement_types';
};

export const groupLoyaltyAbonement = function () {
    startHandler(() => {
        const validClientId: number = Number(clientId);
        const bearer                = getBearerTokenDomAction();
        if (validClientId !== 0 && !isNaN(validClientId)) {
            const container = document.querySelector('#loyalty-abonement-type-app-wrapper');

            if (container) {
                new Col({
                    rows: [
                        new ModalButton({
                            textContent: 'Добавить множество абонементов',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new GroupLoyaltyAbonementMassAddForm({
                                    clientId,
                                    bearer,
                                }),
                                label      : 'Добавить множество абонементов',
                                preferWidth: Modal.getPreferWidthByNesting(1),
                            },
                        }),
                        new ModalButton({
                            textContent: 'Установить филиал везде где',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new AddSalonIdWithSettingsGroupLoyaltyAbonement({
                                    clientId, bearer,
                                }),
                                label      : `Добавить филиал ко всем абонементам`,
                                preferWidth: Modal.getPreferWidthByNesting(1),
                            },
                        }),
                        new ModalButton({
                            textContent: 'Установить филиал везде',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content    : new AddSalonIdGroupLoyaltyAbonementForm({
                                    clientId, bearer,
                                }),
                                label      : 'Добавить филиал ко всем абонементам',
                                preferWidth: Modal.getPreferWidthByNesting(1),
                            },
                        }),
                    ],
                }).insert(container, 'beforebegin');
            }
        }
    });
};