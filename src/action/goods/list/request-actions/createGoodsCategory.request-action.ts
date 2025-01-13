import {
    GoodsCategoryCreateData,
} from '@/action/goods/list/types/goods-category.types.ts';
import {
    ERROR_GOODS_CATEGORY_CREATION,
} from '@/action/goods/list/errors/goods-category.errors.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const createGoodsCategoryRequestAction = async function (clientId: string, createData: GoodsCategoryCreateData, logger?: ILogger): Promise<string> {
    const parentId = createData.pid ?? '0';

    logger?.log(`создание категории товаров "${ createData.title }" для категории "${ parentId }" клиента "${ clientId }"`);

    const formData = new FormData();

    formData.append('title', createData.title);
    formData.append('pid', parentId);
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
                logger?.success(`категория товаров "${ createData.title }"[id:${ categoryId }] категории "${ parentId }" клиента "${ clientId }" создана`);
                return categoryId;
            }

            throw new Error(ERROR_GOODS_CATEGORY_CREATION);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка создания категории товаров "${ createData.title }" категории "${ parentId }" клиента "${ clientId }"`);
            throw error;
        });
};