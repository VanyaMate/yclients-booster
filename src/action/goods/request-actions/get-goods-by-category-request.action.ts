import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GoodApiResponseData,
} from '@/action/goods/types/good.types.ts';


export const getGoodsByCategoryRequestAction = async function (bearer: string, clientId: string, categoryId: string, logger?: ILogger): Promise<GoodApiResponseData> {
    logger?.log(`получение списка товаров категории "${ categoryId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/goods/${ clientId }?category_id=${ categoryId }&count=999999`, {
        method : 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`спискок товаров категории "${ categoryId }" клиента "${ clientId }" получен`);
                return response.json();
            }

            throw new Error(`ошибка ответа сервера. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`спискок товаров категории "${ categoryId }" клиента "${ clientId }" не получен. ${ error.message }`);
            throw error;
        });
};