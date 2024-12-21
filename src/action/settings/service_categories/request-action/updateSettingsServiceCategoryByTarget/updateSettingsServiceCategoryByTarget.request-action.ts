import {
    SettingsServiceCategoriesApiResponse,
    SettingsServiceCategoryData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateSettingsServiceCategoryByTargetRequestAction = async function (
    bearer: string,
    clientId: string,
    categoryId: string,
    clientData: SettingsServiceCategoryData,
    targetData: SettingsServiceCategoryData,
    fetcher: IFetcher = new Fetch(),
    logger?: ILogger,
) {
    const data: SettingsServiceCategoryData = {
        ...clientData,
        booking_title: targetData.booking_title,
        title        : targetData.title,
        translations : targetData.translations,
    };

    logger?.log(`обновление категории услуг "${ categoryId }" "${ clientData.title }" клиента "${ clientId }"`);

    return fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/service_categories/${ categoryId }`, {
        method : 'PATCH',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
        body   : JSON.stringify(data),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка запроса. Статус: ${ response.status }`);
        })
        .then((response: SettingsServiceCategoriesApiResponse) => {
            if (response.success) {
                logger?.success(`категория услуг "${ categoryId }" "${ clientData.title }" клиента "${ clientId }" обновлена`);
                return data;
            }

            throw new Error(`не получилось обновить. ${ response.meta.message }`);
        })
        .catch((e: Error) => {
            logger?.error(`ошибка обновления категории услуг "${ categoryId }" "${ clientData.title }" клиента "${ clientId }". ${ e.message }`);
            throw e;
        });
};