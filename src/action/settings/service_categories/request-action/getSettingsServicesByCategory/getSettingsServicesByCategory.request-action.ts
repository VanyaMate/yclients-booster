import {
    SettingsServiceCategoriesItemApiResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';


export const getSettingsServicesByCategoryRequestAction = function (bearer: string, clientId: string, categoryId: string, logger?: Logger): Promise<SettingsServiceCategoriesItemApiResponse> {
    logger?.log(`получение услуг категории "${ categoryId }" для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/api/v1/company/${ clientId }/services?category_id=${ categoryId }&include=composite_details`, {
        method : 'GET',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`услуги категории "${ categoryId }" для клиента "${ clientId }" получены`);
                return response.json();
            } else {
                logger?.error(`услуги категории "${ categoryId }" для клиента "${ clientId }" не получены`);
                throw response.json();
            }
        });
};