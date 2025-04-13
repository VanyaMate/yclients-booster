import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    GroupLoyaltyAbonementMassAddForm,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/GroupLoyaltyAbonementMassAddForm.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    getGroupLoyaltyAmonements,
} from '@/action/net/group-loyalty-abonement/getGroupLoyaltyAmonements.ts';
import {
    getLoyaltyAmonement,
} from '@/action/net/group-loyalty-abonement/getLoyaltyAmonement.ts';


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
                                preferWidth: 700,
                            },
                        }),
                        new ModalButton({
                            textContent: 'Установить филиал везде где',
                            styleType  : ButtonStyleType.PRIMARY,
                            modalProps : {
                                content: new Button({
                                    onclick    : async () => {
                                        console.log('start');
                                        const targetAbonementId = 930235;
                                        const abonements        = await getGroupLoyaltyAmonements(bearer, clientId, 1, [ 'attached_salon_ids', 'availability', 'online_sale_image' ]);
                                        const abonement         = abonements.find((abonement) => abonement.id === targetAbonementId)!;
                                        const abonementFullData = await getLoyaltyAmonement(bearer, clientId, abonement.id.toString(), [ 'attached_salon_ids' ]);
                                        console.log(abonementFullData);
                                    },
                                    textContent: 'Получить',
                                }),
                            },
                        }),
                    ],
                }).insert(container, 'beforebegin');
            }
        }
    });
};