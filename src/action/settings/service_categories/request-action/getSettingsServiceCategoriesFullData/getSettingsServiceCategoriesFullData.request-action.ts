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


export const getSettingsServiceCategoriesFullDataRequestAction = async function (bearer: string, clientId: string): Promise<SettingsServiceCategoryResponse> {
    const response: SettingsServiceCategoryResponse = {
        list          : [],
        serviceMapper : {},
        categoryMapper: {},
    };
    const categories                                = await getSettingsServiceCategoriesRequestAction(bearer, clientId);
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
                        const services        = await getSettingsServicesByCategoryRequestAction(bearer, clientId, category.id.toString());
                        categoryItem.children = services.data;
                        services.data.forEach((service) => {
                            response.serviceMapper[service.id.toString()] = service;
                        });
                    },
                ],
            };
        }),
    )
        .then(() => response)
        .catch(() => {
            throw new Error(ERROR_SETTINGS_SERVICE_CATEGORIES_CANNOT_GET_DATA);
        });
};