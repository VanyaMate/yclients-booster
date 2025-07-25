import {
    GroupLoyaltyCertificateShortData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    getGroupLoyaltyCertificatesShortDataFromDom,
} from '@/action/net/group-loyalty-certificate/dom-action/getGroupLoyaltyCertificatesShortDataFromDom.ts';


export const getGroupLoyaltyShortDataCertificates = async function (salonId: string, logger?: ILogger): Promise<Array<GroupLoyaltyCertificateShortData>> {
    logger?.log(`получение списка сертификатов клиента "${ salonId }"`);

    return fetch(`https://yclients.com/group_loyalty_certificate_types/${ salonId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(getGroupLoyaltyCertificatesShortDataFromDom)
        .then((items) => {
            logger?.success(`список сертификатов клиента "${ salonId }" получен. ${ items.length } шт.`);
            return items;
        })
        .catch((error: Error) => {
            logger?.warning(`не удалось получить список сертификатов клиента "${ salonId }". ${ error.message }`);
            return [];
        });
};