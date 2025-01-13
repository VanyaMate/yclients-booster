import { GoodUpdateData } from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const changeCategoryOfGoodRequestAction = async function (clientId: string, previousCategoryId: string, goodId: string, updateData: GoodUpdateData, logger?: ILogger): Promise<boolean> {
    logger?.log(`обновление категории товара "${ goodId }" с "${ previousCategoryId }" -> "${ updateData.category_id }"`);

    const formData = new FormData();
    Object.entries(updateData).forEach(([ key, value ]) => {
        formData.set(key, value.toString());
    });

    return fetch(`https://yclients.com/goods/save/${ clientId }/${ previousCategoryId }/${ goodId }/`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`обновление категории товара "${ goodId }" с "${ previousCategoryId }" -> "${ updateData.category_id }" завершено`);
                return true;
            }

            throw new Error(`ошибка ответа от сервера. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`обновление категории товара "${ goodId }" с "${ previousCategoryId }" -> "${ updateData.category_id }" не завершено. ${ error.message }`);
            throw error;
        });
};