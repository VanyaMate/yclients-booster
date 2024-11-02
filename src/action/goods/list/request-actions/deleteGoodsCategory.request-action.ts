import {
    ERROR_GOODS_CATEGORY_DELETE,
} from '@/action/goods/list/errors/goods-category.errors.ts';


export const deleteGoodsCategoryRequestAction = function (clientId: string, categoryId: string): Promise<boolean> {
    return fetch(`https://yclients.com/goods/category_delete/${ clientId }/${ categoryId }`, {
        method: 'POST',
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(ERROR_GOODS_CATEGORY_DELETE);
        })
        .then((data: any) => {
            return data?.success ?? false;
        });
};