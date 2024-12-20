import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    SettingsServiceItemApiResponse,
    SettingsServiceItemCreateData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


/**
 * Если у двух разных услуг будет одинаковый categoryId, title и booking_title
 * то при MemoFetch будет лишь один запрос
 */

export const createSettingsServiceItemRequestAction = async function (bearer: string, clientId: string, createData: SettingsServiceItemCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<SettingsServiceItemApiResponse> {
    logger?.log(`создание новой услуги "${ createData.title }" для "${ clientId }"`);
    return fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/services?categoryId=${ createData.category_id }&title=${ createData.title }&booking_title=${ createData.booking_title }`, {
        method : 'POST',
        body   : JSON.stringify(createData),
        headers: {
            'Authorization': `Bearer ${ bearer }`,
            'Content-Type' : 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`новая услуга "${ createData.title }" для "${ clientId }" создана`);
            } else {
                logger?.error(`новая услуга "${ createData.title }" для "${ clientId }" не создана`);
            }
            return response.json();
        })
        .then((response) => response.data)
        .catch((e) => {
            logger?.error(`новая услуга "${ createData.title }" для "${ clientId }" не создана`);
            throw e;
        });
};