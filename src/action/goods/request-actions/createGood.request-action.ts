// https://yclients.com/goods/save/1092329/0/0/ POST FormData<GoodData>

import {
    GoodCreateData,
    GoodData,
} from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


export const createGoodRequestAction = async function (clientId: string, createData: GoodCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<GoodData> {
    logger?.log(`создание товара "${ createData.title }" для категории "${ createData.category_id }" клиента "${ clientId }"`);

    const body = convertToFormData(createData);

    return fetcher.fetch(`https://yclients.com/goods/save/${ clientId }/0/0/?clientId=${ clientId }&categoryId=${ createData.category_id }&title=${ createData.title }`, {
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
            // "/goods/edit/1092329/1454508/35505992/" ->
            // response.meta.redirect_url

            if (response.success) {
                logger?.success(`создание товара "${ createData.title }" для категории "${ createData.category_id }" клиента "${ clientId }" прошло успешно`);
                return {
                    ...createData,
                    id: response.meta.redirect_url.split('/').slice(-2)[0],
                };
            }

            throw new Error(`ошибка обновления. ${ response?.meta?.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка создания товара "${ createData.title }" для категории "${ createData.category_id }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};