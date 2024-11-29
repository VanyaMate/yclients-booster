import {
    SettingsServiceCategoriesApiResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getSettingsServiceCategoriesRequestAction = function (bearer: string, clientId: string, logger?: ILogger): Promise<SettingsServiceCategoriesApiResponse> {
    logger?.log(`получение списка категорий услуг для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/api/v1/company/${ clientId }/service_categories?include=services_count&include[]=translations`, {
        method : 'GET',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`список категорий услуг для клиента "${ clientId }" получен`);
                return response.json();
            } else {
                logger?.error(`список категорий услуг для клиента "${ clientId }" не получен`);
                throw response.json();
            }
        });

    /*    return fetch(`https://yclients.com/settings/service_categories/${ clientId }/`, {
     method: 'GET',
     })
     .then(fetchResponseToDom)
     .then((dom: Document) => {
     const container = dom.querySelector<HTMLDivElement>('.erp-services-categories-list__content');

     console.log('Container', container);

     if (container) {
     const response: SettingsServiceCategoryResponse = {
     list  : [],
     mapper: {},
     };
     const categories                                = container.querySelectorAll<HTMLDivElement>('.erp-services-categories-list-item');

     let category: HTMLDivElement | null = null;
     let categoryId: string | null       = null;
     let categoryTitle: string | null    = null;
     for (let i = 0; i < categories.length; i++) {
     category      = categories[i]!;
     categoryId    = category.getAttribute('data-locator')?.split('_').slice(-1)[0] ?? null;
     categoryTitle = category.querySelector('.erp-services-categories-list-item__title-text')!.textContent!.trim();

     console.log('CategoryID', categoryId);

     if (categoryId) {
     // Response
     const categoryItem: SettingsServiceCategoryItem = {
     id      : categoryId,
     title   : categoryTitle,
     children: [],
     };
     response.list.push(categoryItem);
     response.mapper[categoryId] = categoryTitle;

     // Services
     const services = category.querySelectorAll<HTMLDivElement>('.erp-services-categories-service');

     let service: HTMLDivElement | null = null;
     let serviceId: string | null       = null;
     let serviceTitle: string | null    = null;

     for (let j = 0; j < services.length; j++) {
     service      = services[i]!;
     serviceId    = service.getAttribute('data-locator')?.split('_').slice(-1)[0] ?? null;
     serviceTitle = service.querySelector<HTMLSpanElement>('.erp-services-categories-service-title > a > span')!.textContent!.trim();

     console.log('ServiceID', serviceId);

     if (serviceId) {
     // Response
     categoryItem.children.push({
     id   : serviceId,
     title: serviceTitle,
     });
     response.mapper[serviceId] = serviceTitle;
     } else {
     throw new Error(ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA);
     }
     }
     } else {
     throw new Error(ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA);
     }
     }

     return response;
     }

     throw new Error(ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA);
     });*/
};