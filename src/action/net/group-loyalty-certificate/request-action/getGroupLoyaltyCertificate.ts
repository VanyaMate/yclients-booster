import {
    GroupLoyaltyCertificateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    getGroupLoyaltyCertificateDataFromDom,
} from '@/action/net/group-loyalty-certificate/dom-action/getGroupLoyaltyCertificateDataFromDom.ts';


export const getGroupLoyaltyCertificate = async function (clientId: string, certificateId: string, logger?: ILogger): Promise<GroupLoyaltyCertificateData> {
    logger?.log(`попытка получить сертификат "${ certificateId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/group_loyalty_certificate_types/edit/${ clientId }/${ certificateId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom) => getGroupLoyaltyCertificateDataFromDom(dom, logger))
        .then((data) => {
            logger?.success(`сертификат "${ certificateId }" клиента "${ clientId }" получен`);
            return data;
        })
        .catch((error) => {
            logger?.error(`сертификат "${ certificateId }" клиента "${ clientId }" не получен. ${ error.message }`);
            throw error;
        });
};