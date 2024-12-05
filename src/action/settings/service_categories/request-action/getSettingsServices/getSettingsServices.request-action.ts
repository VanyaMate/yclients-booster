// https://yclients.com/api/v1/company/1092329/services

import {
    SettingsServiceItemApiResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getSettingsServicesRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<SettingsServiceItemApiResponse> {
    logger?.log(`получение услуг клиента "${ clientId }"`);
    return fetch(`https://yclients.com/api/v1/company/${ clientId }/services?include=composite_details&include[]=chain_details&include=delete_image&include=image_group&include=is_category&include[]=is_range_price_enabled&include[]=translations&include[]=salon_group_title&include[]=salon_group_service_link&include[]=kkm_settings_id&include[]=is_linked_to_composite`, {
        method : 'GET',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`услуги клиента "${ clientId }" получены`);
                return response.json();
            } else {
                logger?.error(`услуги клиента "${ clientId }" не получены`);
                throw response.json();
            }
        });
};