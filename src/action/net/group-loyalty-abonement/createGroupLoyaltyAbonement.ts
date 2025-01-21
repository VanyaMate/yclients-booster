// https://yclients.com/api/v1/chain/1093672/loyalty/abonement_types POST
// https://yclients.com/api/v1/chain/1093672/loyalty/abonement_types/927283 PUT

import {
    GroupLoyaltyAbonementCreateData,
} from '@/action/net/group-loyalty-abonement/types/types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const createGroupLoyaltyAbonement = async function (bearer: string, clientId: string, createData: GroupLoyaltyAbonementCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger) {
    return fetcher.fetch(`https://yclients.com/api/v1/chain/${ clientId }/loyalty/abonement_types?clientId=${ clientId }&title=${ createData.title }`, {
        method : 'POST',
        body   : JSON.stringify(createData),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            if (response.status === 400 || response.status === 422) {
                return response.json();
            }

            throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`абонемент "${ createData.title }" клиента "${ clientId }" успешно создан`);
                return true;
            }

            throw new Error(`ошибка создания абонемента. ${ JSON.stringify(response?.meta ?? 'Неизвестная ошибка') }`);
        })
        .catch((error: Error) => {
            logger?.error(`не получилось создать абонемент "${ createData.title }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};