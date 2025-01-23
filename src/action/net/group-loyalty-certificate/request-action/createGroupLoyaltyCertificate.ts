import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GroupLoyaltyCertificateCreateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';

// https://yclients.com/group_loyalty_certificate_types/edit/1093672/0 POST
// FormData

export const createGroupLoyaltyCertificate = async function (salonId: string, createData: GroupLoyaltyCertificateCreateData, logger?: ILogger) {
    logger?.log(`создание сертификата "${ createData.title }" для клиента "${ salonId }"`);

    const formData = convertToFormData(createData);
    formData.delete('salon_ids');
    const salonIds: Array<string> = createData.salon_ids.split(',');
    salonIds.forEach((id) => {
        formData.append(`salon_ids[]`, id);

    });

    return fetch(`https://yclients.com/group_loyalty_certificate_types/edit/${ salonId }/0`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.log(`сертификат "${ createData.title }" для клиента "${ salonId }" создан`);
                return true;
            }

            throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`не удалось создать сертификат "${ createData.title }" для клиента "${ salonId }"`);
            throw error;
        });
};