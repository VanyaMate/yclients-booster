import { GoodData, GoodUpdateData } from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


export const updateGoodRequestAction = async function (clientId: string, goodId: string, updateData: GoodUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<GoodData> {
    logger?.log(`обновление товара "${ goodId }" категории "${ updateData.category_id }" клиента "${ clientId }"`);

    const body = convertToFormData(updateData);

    return fetcher.fetch(`https://yclients.com/goods/save/${ clientId }/${ updateData.category_id }/${ goodId }/`, {
        method: 'POST',
        body,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа с сервера. Статус: ${ response.status }`);
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`обновление товара "${ goodId }" категории "${ updateData.category_id }" клиента "${ clientId }" прошло успешно`);
                return { ...updateData, id: goodId };
            }

            throw new Error(`ошибка обновления. ${ response?.meta?.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка обновления товара "${ goodId }" категории "${ updateData.category_id }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};