import {
    GoodApiResponseData,
    GoodData,
} from '@/action/goods/types/good.types.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getGoodsByCategoryRequestAction,
} from '@/action/goods/request-actions/get-goods-by-category-request.action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    getGoodRequestAction,
} from '@/action/goods/request-actions/getGood.request-action.ts';


export const getGoodsSortByCategoriesRequestAction = async function (bearer: string, clientId: string, categoriesIds: Array<string>, logger?: ILogger): Promise<Record<string, Array<GoodData>>> {
    // get goods ids by category id
    // get goods step by step
    // return

    return new PromiseSplitter(5, 1).exec<Array<GoodData>>(
        categoriesIds.map((categoryId) => ({
            chain: [
                async () => getGoodsByCategoryRequestAction(bearer, clientId, categoryId, logger),
                async (goodsList: GoodApiResponseData) => {
                    return await new PromiseSplitter(5, 1).exec<GoodData>((
                        goodsList.map((good) => ({
                            chain: [
                                () => getGoodRequestAction(clientId, categoryId, good.good_id.toString(), logger),
                            ],
                        }))
                    ));
                },
            ],
        })),
    ).then((goodsByCategories) => {
        return goodsByCategories.reduce((acc, goods) => {
            const goodCategoryId = goods[0]?.category_id;
            if (goodCategoryId !== undefined) {
                acc[goodCategoryId] = goods;
            }
            return acc;
        }, {} as Record<string, Array<GoodData>>);
    });
};