import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    GroupLoyaltyAbonementMassAddForm,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/GroupLoyaltyAbonementMassAddForm.ts';


let clientId: string = '';

export const isGroupLoyaltyAbonement = function (paths: Array<string>): boolean {
    clientId = paths[2];
    return paths[1] === 'group_loyalty_abonement_types';
};

export const groupLoyaltyAbonement = function () {
    startHandler(() => {
        const validClientId: number = Number(clientId);
        if (validClientId !== 0 && !isNaN(validClientId)) {
            const container = document.querySelector('#loyalty-abonement-type-app-wrapper');

            if (container) {
                new Col({
                    rows: [
                        new GroupLoyaltyAbonementMassAddForm({
                            clientId,
                        }),
                    ],
                }).insert(container, 'beforebegin');
            }
        }
    });
};