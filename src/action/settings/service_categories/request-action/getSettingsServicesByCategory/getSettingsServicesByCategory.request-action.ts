import {
    SettingsServiceCategoriesItemApiResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const getSettingsServicesByCategoryRequestAction = function (bearer: string, clientId: string, categoryId: string): Promise<SettingsServiceCategoriesItemApiResponse> {
    return fetch(`https://yclients.com/api/v1/company/${ clientId }/services?category_id=${ categoryId }&include=composite_details`, {
        method : 'GET',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => response.json());
};