import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    GroupLoyaltyCertificateMassAddForm,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateMassAddForm/GroupLoyaltyCertificateMassAddForm.ts';


let clientId: string = '';

export const isGroupLoyaltyCertificate = function (paths: Array<string>): boolean {
    clientId = paths[2];
    return paths[1] === 'group_loyalty_certificate_types';
};

export const groupLoyaltyCertificate = function () {
    startHandler(() => {
        const validClientId: number = Number(clientId);
        if (validClientId !== 0 && !isNaN(validClientId)) {
            const container = document.querySelector(`#loyalty-certificate-type-app-wrapper`);

            if (container) {
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
                    ],
                }).insert(container, 'beforebegin');
            }
        }
    });
};