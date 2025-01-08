import { GoodData } from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    getGoodDomAction,
} from '@/action/goods/dom-action/getGood.dom-action.ts';


export const getGoodRequestAction = async function (clientId: string, categoryId: string, goodId: string, logger?: ILogger): Promise<GoodData> {
    logger?.log(`получение информации о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/goods/edit/${ clientId }/${ categoryId }/${ goodId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(getGoodDomAction)
        .then((data) => {
            logger?.success(`информация о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }" получена`);
            return data;
        })
        .catch((error: Error) => {
            logger?.error(`информация о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }" не получена. ${ error.message }`);
            throw error;
        });
};