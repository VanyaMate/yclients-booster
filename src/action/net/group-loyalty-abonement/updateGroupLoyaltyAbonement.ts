/**
 * PUT
 * https://yclients.com/api/v1/chain/1093672/loyalty/abonement_types/930229
 */
import {
    GroupLoyaltyAbonementUpdateData,
    GroupLoyaltyFullDataResponse,
} from '@/action/net/group-loyalty-abonement/types/types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateGroupLoyaltyAbonement = async function (bearer: string, clientId: string, abonementId: string, data: GroupLoyaltyAbonementUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<GroupLoyaltyFullDataResponse> {
    logger?.log(`попытка обновить абонемент "${ abonementId }" клиента "${ clientId }"`);

    return fetcher.fetch(`https://yclients.com/api/v1/chain/${ clientId }/loyalty/abonement_types/${ abonementId }`, {
        method : 'PUT',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
        body   : JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
        })
        .then((response) => {
            logger?.success(`абонемент "${ abonementId }" клиента "${ clientId }" обновлен`);
            return response.data;
        })
        .catch((error: Error) => {
            logger?.error(`абонемент "${ abonementId }" клиента "${ clientId }" не обновлен. ${ error.message }`);
            throw error;
        });
};