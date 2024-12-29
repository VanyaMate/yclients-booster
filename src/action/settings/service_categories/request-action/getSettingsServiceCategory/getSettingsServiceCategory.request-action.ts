import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    SettingsServiceCategoryData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const getSettingsServiceCategoryRequestAction = async function (bearer: string, clientId: string, categoryId: string, logger?: ILogger): Promise<SettingsServiceCategoryData> {
    logger?.log(`получение полной информации о категории "${ categoryId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/company/${ clientId }/service_categories/${ categoryId }?include=translations`, {
        method : 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка запроса. Статус: ${ response.status }`);
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`информация о категории "${ categoryId }" клиента "${ clientId }" получена`);
                return response.data;
            }

            throw new Error(`ошибка запроса. ${ response?.meta?.message }`);
        })
        .catch((error: Error) => {
            logger?.error(`информация о категории "${ categoryId }" клиента "${ clientId }" не получена. ${ error.message }`);

            throw error;
        });
};