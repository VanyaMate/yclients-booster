import {
    GoodsCategoryUpdateData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateGoodCategoryRequestAction = async function (clientId: string, categoryId: string, updateData: GoodsCategoryUpdateData, logger?: ILogger): Promise<string> {
    logger?.log(`обновление категории товаров "${ categoryId }" клиента "${ clientId }"`);

    const formData = new FormData();

    formData.append('title', updateData.title);
    formData.append('pid', updateData.pid);
    formData.append('article', updateData.article);
    formData.append('comment', updateData.comment);
    formData.append('confirm_delete', '');

    return fetch(`https://yclients.com/goods/category_save/${ clientId }/${ categoryId }/`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
            }
        })
        .then((data) => {
            if (data?.success) {
                const categoryId: string = data?.meta?.redirect_url?.split('/').slice(-2)[0] ?? '';
                logger?.success(`категория товаров "${ updateData.title }"[id: ${ categoryId }] категории "${ updateData.pid }" клиента "${ clientId }" изменена`);
                return categoryId;
            }

            throw new Error(`ошибка обновления категории`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка обновления категории товаров "${ updateData.title }" категории "${ updateData.pid }" клиента "${ clientId }"`);
            throw error;
        });
};