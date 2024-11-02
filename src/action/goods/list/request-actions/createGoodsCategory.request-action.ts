import {
    GoodsCategoryCreateData, GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import {
    getGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategory.request-action.ts';
import {
    ERROR_GOODS_CATEGORY_CREATION,
} from '@/action/goods/list/errors/goods-category.errors.ts';


export const createGoodsCategoryRequestAction = function (clientId: string, createData: GoodsCategoryCreateData): Promise<GoodsCategoryFullData> {
    const formData = new FormData();

    formData.append('title', createData.title);
    formData.append('pid', createData.pid ?? '0');
    formData.append('article', createData.article ?? '');
    formData.append('comment', createData.comment ?? '');

    return fetch(`https://yclients.com/goods/category_save/${ clientId }/0/`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(ERROR_GOODS_CATEGORY_CREATION);
            }
        })
        .then((data: any) => {
            if (data?.success) {
                const categoryId: string = data?.meta?.redirect_url?.split('/').slice(-2)[0] ?? '';

                if (categoryId) {
                    return getGoodsCategoryRequestAction(clientId, categoryId);
                }
            }

            throw new Error(ERROR_GOODS_CATEGORY_CREATION);
        });
};