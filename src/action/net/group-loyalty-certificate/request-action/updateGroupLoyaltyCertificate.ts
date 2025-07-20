import {
    GroupLoyaltyCertificateUpdateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateGroupLoyaltyCertificate = async function (clientId: string, certificateId: string, updateData: GroupLoyaltyCertificateUpdateData, logger?: ILogger): Promise<void> {
    // https://yclients.com/group_loyalty_certificate_types/edit/1093672/541770

    logger?.log(`попытка обновить сертификат "${ certificateId }" клиента "${ clientId }"`);
    const formData = convertToFormData(updateData);

    return fetch(`https://yclients.com/group_loyalty_certificate_types/edit/${ clientId }/${ certificateId }`, {
        method: 'POST',
        body  : formData,
    })
        .then(() => {
            logger?.success(`сертификат "${ certificateId }" клиента "${ clientId }" обновлен`);
        })
        .catch((error) => {
            logger?.error(`сертификат "${ certificateId }" клиента "${ clientId }" не обновлен. ${ error.message }`);
        });
};