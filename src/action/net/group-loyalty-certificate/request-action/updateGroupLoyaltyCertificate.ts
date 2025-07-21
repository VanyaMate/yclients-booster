import {
    GroupLoyaltyCertificateUpdateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';


export const updateGroupLoyaltyCertificate = async function (clientId: string, certificateId: string, updateData: GroupLoyaltyCertificateUpdateData, fetcher: Fetch = new Fetch(), logger?: ILogger): Promise<void> {
    // https://yclients.com/group_loyalty_certificate_types/edit/1093672/541770

    logger?.log(`попытка обновить сертификат "${ certificateId }" клиента "${ clientId }"`);
    const formData = convertToFormData(updateData);

    formData.delete('salon_ids');
    updateData.salon_ids.split(',').forEach((id) => formData.append('salon_ids[]', id));

    return fetcher.fetch(`https://yclients.com/group_loyalty_certificate_types/edit/${ clientId }/${ certificateId }`, {
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