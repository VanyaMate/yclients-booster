import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    SettingsServiceCategoryCreateData, SettingsServiceCategoryData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';


/**
 * Если у двух разных категорий будет одинаковый title и booking_title
 * то при MemoFetch будет лишь один запрос
 */

export const createSettingsServiceCategoryRequestAction = async function (bearer: string, clientId: string, createData: SettingsServiceCategoryCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<SettingsServiceCategoryData> {
    logger?.log(`создание новой категории услуг "${ createData.title }" для "${ clientId }"`);
    return fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/service_categories?title=${ createData.title }&booking_title=${ createData.booking_title }`, {
        method : 'POST',
        body   : JSON.stringify(createData),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`новая категория услуг "${ createData.title }" для "${ clientId }" создана`);
            } else {
                logger?.error(`новая категория услуг "${ createData.title }" для "${ clientId }" не создана`);
            }
            return response.json();
        })
        .then((response) => response.data)
        .catch((e) => {
            logger?.error(`новая категория услуг "${ createData.title }" для "${ clientId }" не создана`);
            throw e;
        });
};