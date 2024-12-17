import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    SalaryCriteriaFullData, SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    getSalaryCriteriaListRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaList/getSalaryCriteriaList.request-action.ts';
import {
    getSalaryCriteriaRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteria/getSalaryCriteria.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getSettingsServiceCategoriesRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategories/getSettingsServiceCategories.request-action.ts';
import {
    getSettingsServicesByCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServicesByCategory/getSettingsServicesByCategory.request-action.ts';
import {
    SettingsServiceItemApiResponse,
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const getSalaryCriteriaListDataForCopyRequestAction = async function (bearer: string, clientId: string, forceUploadServices: boolean, maxSplit: number, maxRetry: number, logger?: ILogger): Promise<SalaryCriteriaListDataForCopy> {
    logger?.log(`получение списка критериев расчета для клиента ${ clientId } с полной информацией`);
    const list                                       = await getSalaryCriteriaListRequestAction(clientId, logger);
    const splitter                                   = new PromiseSplitter(maxSplit, maxRetry);
    const dataForCopy: SalaryCriteriaListDataForCopy = {
        criteriaList    : [],
        settingsCopyData: {
            tree            : [],
            categoriesMapper: {},
            servicesMapper  : {},
        },
    };

    await splitter.exec(
        list.map((item) => ({
            chain: [
                async () => getSalaryCriteriaRequestAction(clientId, item.id, logger),
                async (data: unknown) => {
                    dataForCopy.criteriaList.push(data as SalaryCriteriaFullData);
                    return data;
                },
            ],
        })),
    );

    const hasServices = dataForCopy.criteriaList.some((item) => item.rules.some((rule) => !!rule.context.services));

    if (hasServices || forceUploadServices) {
        const serviceCategories = await getSettingsServiceCategoriesRequestAction(bearer, clientId, logger);
        await splitter.exec(
            serviceCategories.data.map((category) => {
                dataForCopy.settingsCopyData.categoriesMapper[category.id.toString()] = category;
                const data: SettingsServiceCategoryDataWithChildren                   = {
                    ...category,
                    children: [],
                };
                dataForCopy.settingsCopyData.tree.push(data);

                return {
                    chain: [
                        async () => getSettingsServicesByCategoryRequestAction(bearer, clientId, category.id.toString(), logger),
                        async (response: unknown) => {
                            // ну и дичь :D
                            if (((val): val is SettingsServiceItemApiResponse => !!val)(response)) {
                                data.children = response.data;
                                response.data.forEach((service) => {
                                    dataForCopy.settingsCopyData.servicesMapper[service.id.toString()] = service;
                                });
                            }
                        },
                    ],
                };
            }),
        );
    }

    return dataForCopy;
};