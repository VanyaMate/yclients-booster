import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getLoyaltyAmonement = async function (bearer: string, clientId: string, abonementId: string, include: Array<string>, logger?: ILogger) {
    logger?.log(`попытка получения абонемента "${ abonementId }" клиента "${ clientId }"`);
    const includes = include.map((item, index) => `include[${ index }]=${ item }`);
    return fetch(`https://yclients.com/api/v1/chain/1093672/loyalty/abonement_types/930235?${ includes }`, {
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
        .then((response) => {
            if (response.success) {
                logger?.success(`абонемент "${ abonementId }" клиента "${ clientId }" получен`);
                return response.data;
            }

            throw new Error(`ошибка ответа. ${ response?.meta?.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка получения абонемента "${ abonementId }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};