// https://yclients.com/goods/list/1092329

import {
    GoodsCategoryChainData,
    GoodsCategoryShortData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getGoodsCategoriesRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<Array<GoodsCategoryShortData>> {
    logger?.log(`получение категорий товаров клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/company/${ clientId }/goods_categories`, {
        method : 'GET',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
            'Content-Type' : 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа. Статус: ${ response.status }`);
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`категории товаров клиента "${ clientId }" получены`);
                return response.data.map((category: GoodsCategoryChainData) => ({
                    id   : category.id.toString(),
                    title: category.title,
                }));
            }

            throw new Error(`ошибка запроса. ${ response.meta.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка получения категорий товаров клиента "${ clientId }"`);
            throw error;
        });
};