import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    getGoodsCategoriesRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategories.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    getGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategory.request-action.ts';
import {
    GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export const getGoodsCategoriesFullDataRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<Array<GoodsCategoryFullData>> {
    logger?.log(`получение списка категорий товаров клиента "${ clientId }" с полной информацией`);

    const categoriesShotInfoList = await getGoodsCategoriesRequestAction(bearer, clientId, logger);
    const categoriesFullInfoList = await new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_REQUESTS)
        .exec<GoodsCategoryFullData>(
            categoriesShotInfoList.map((shortInfo) => ({
                chain: [
                    () => getGoodsCategoryRequestAction(clientId, shortInfo.id, logger),
                ],
            })),
        );

    const categories = categoriesFullInfoList.filter(Boolean);

    if (categories.length !== categoriesShotInfoList.length) {
        logger?.warning(`получены не все данные о категориях товара клиента "${ clientId }". не хватает: ${ categoriesShotInfoList.length - categories.length }`);
    } else {
        logger?.success(`все данные о всех категориях товаров клиента "${ clientId }" получены`);
    }

    return categories;
};