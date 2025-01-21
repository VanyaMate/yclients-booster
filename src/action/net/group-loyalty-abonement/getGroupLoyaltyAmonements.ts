// GET https://yclients.com/api/v1/chain/1093672/loyalty/abonement_types?page=1&limit=250&is_archived=0&title=

import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GroupLoyaltyAbonementCreateData,
} from '@/action/net/group-loyalty-abonement/types/types.ts';


// Тут не такой тип возвращается, но пофигу
export const getGroupLoyaltyAmonements = async function (bearer: string, salonId: string, page: number = 1, logger?: ILogger): Promise<Array<GroupLoyaltyAbonementCreateData>> {
    logger?.log(`получение списка абонементов клиента "${ salonId }"`);

    return fetch(`https://yclients.com/api/v1/chain/${ salonId }/loyalty/abonement_types?page=${ page }&limit=250&is_archived=0&title=`, {
        method : 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization : `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
        })
        .then(async (response) => {
            if (response.success) {
                logger?.success(`абонементы клиента "${ salonId }" получены`);

                if (response.meta.total_count <= 250 * page) {
                    return response.data;
                }

                const abonemets = await getGroupLoyaltyAmonements(bearer, salonId, page + 1, logger);
                return [ ...response.data, ...abonemets ];
            }

            throw new Error(`ошибка запроса. ${ response?.meta?.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка получения абонементов клиента "${ salonId }". ${ error.message }`);
            throw error;
        });
};