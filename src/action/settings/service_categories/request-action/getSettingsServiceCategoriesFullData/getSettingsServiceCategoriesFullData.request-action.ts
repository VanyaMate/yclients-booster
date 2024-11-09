import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCategoryResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    getSettingsServiceCategoriesRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategories/getSettingsServiceCategories.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    getSettingsServicesByCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServicesByCategory/getSettingsServicesByCategory.request-action.ts';
import {
    ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA,
} from '@/action/settings/service_categories/errors/settings-service_categories.errors.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getSettingsServiceCategoriesFullDataRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<SettingsServiceCategoryResponse> {
    logger?.log(`получение списка категорий услуг и списка услуг с полными данными для клиента "${ clientId }"`);
    const response: SettingsServiceCategoryResponse = {
        list          : [],
        serviceMapper : {},
        categoryMapper: {},
    };
    const categories                                = await getSettingsServiceCategoriesRequestAction(bearer, clientId, logger);
    const promiseSplitter: PromiseSplitter          = new PromiseSplitter(1, PROMISE_SPLITTER_MAX_RETRY);
    return await promiseSplitter.exec(
        categories.data.map((category) => {
            const categoryItem: SettingsServiceCategoryDataWithChildren = {
                ...category,
                children: [],
            };
            response.list.push(categoryItem);
            response.categoryMapper[category.id] = category;

            return {
                chain: [
                    async () => {
                        const services        = await getSettingsServicesByCategoryRequestAction(bearer, clientId, category.id.toString(), logger);
                        categoryItem.children = services.data;
                        services.data.forEach((service) => {
                            response.serviceMapper[service.id.toString()] = service;
                        });
                    },
                ],
            };
        }),
    )
        .then(() => {
            logger?.success(`список категорий услуг и список услуг с полными данными для клиента "${ clientId }" получены`);
            return response;
        })
        .catch(() => {
            logger?.error(`список категорий услуг и список услуг с полными данными для клиента "${ clientId }" не получены`);
            throw new Error(ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA);
        });
};