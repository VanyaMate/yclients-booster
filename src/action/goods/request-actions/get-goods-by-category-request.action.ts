import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GoodApiResponseData,
} from '@/action/goods/types/good.types.ts';


export const getGoodsByCategoryRequestAction = async function (bearer: string, clientId: string, categoryId: string, logger?: ILogger): Promise<GoodApiResponseData> {
    logger?.log(`получение всех товаров категории "${ categoryId }" клиента "${ clientId }"`);

    const result: GoodApiResponseData = [];
    const takeAmount                  = 25;
    let page                          = 1;
    let isFinish                      = false;

    while (!isFinish) {
        logger?.log(`получение списка товаров категории "${ categoryId }" клиента "${ clientId }" страницы "${ page }"`);
        await fetch(`https://yclients.com/api/v1/goods/${ clientId }?category_id=${ categoryId }&count=${ takeAmount }&page=${ page }`, {
            method : 'GET',
            headers: {
                'Content-Type' : 'application/json',
                'Authorization': `Bearer ${ bearer }`,
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(`ошибка ответа сервера. Статус: ${ response.status }`);
            })
            .then((list: GoodApiResponseData) => {
                result.push(...list);
                logger?.success(`получено "${ list.length }" товаров из категории "${ categoryId }" клиента "${ clientId }" со страницы "${ page }"`);

                if (list.length !== takeAmount) {
                    logger?.success(`все товары категории "${ categoryId }" клиента "${ clientId }" получены`);
                    isFinish = true;
                } else {
                    page += 1;
                }
            })
            .catch((error: Error) => {
                logger?.error(`список товаров категории "${ categoryId }" клиента "${ clientId }" страницы "${ page }" не получен. ${ error.message }`);
                isFinish = true;
                throw error;
            });
    }

    return result;
};