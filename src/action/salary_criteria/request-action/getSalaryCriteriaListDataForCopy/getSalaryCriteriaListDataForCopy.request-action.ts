import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    SalaryCriteriaFullData,
    SalaryCriteriaListDataForCopy,
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
    SettingsServiceCategoryData,
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceItemApiResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { Is } from '@/types/Is.ts';
import {
    uploadResourcesWithInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourcesWithInstances/upload-resources-with-instances-request.action.ts';
import {
    getSettingsServiceCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategory/getSettingsServiceCategory.request-action.ts';
import {
    getGoodsCategoriesRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategories.request-action.ts';
import {
    getGoodsSortByCategoriesRequestAction,
} from '@/action/goods/request-actions/getGoodsSortByCategories.request-action.ts';


export const getSalaryCriteriaListDataForCopyRequestAction = async function (bearer: string, clientId: string, forceUploadServices: boolean, forceUploadGoods: boolean, maxSplit: number, maxRetry: number, logger?: ILogger): Promise<SalaryCriteriaListDataForCopy> {
    logger?.log(`получение списка критериев расчета для клиента "${ clientId }" с полной информацией`);
    const list                                       = await getSalaryCriteriaListRequestAction(clientId, logger);
    const splitter                                   = new PromiseSplitter(maxSplit, maxRetry);
    const dataForCopy: SalaryCriteriaListDataForCopy = {
        criteriaList    : [],
        settingsCopyData: {
            tree            : [],
            categoriesMapper: {},
            servicesMapper  : {},
            resources       : [],
        },
        goodsCopyData   : {
            goods     : [],
            categories: {
                list  : [],
                mapper: {},
            },
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

    const hasServices = dataForCopy.criteriaList.some((criteria) => criteria.rules.some((rule) => !!rule.context.services));
    const hasGoods    = dataForCopy.criteriaList.some((criteria) => criteria.rules.some((rule) => !!rule.context.goods));

    if (hasServices || forceUploadServices) {
        const serviceCategories                = await getSettingsServiceCategoriesRequestAction(bearer, clientId, logger);
        dataForCopy.settingsCopyData.resources = await uploadResourcesWithInstancesRequestAction(clientId, maxSplit, maxRetry, logger);
        await splitter.exec(
            serviceCategories.data.map((category, index) => ({
                chain: [
                    () => getSettingsServiceCategoryRequestAction(bearer, clientId, category.id.toString(), logger),
                    async (data: unknown) => {
                        if (Is<SettingsServiceCategoryData>(data)) {
                            serviceCategories.data[index] = data;
                        }
                    },
                ],
            })),
        );

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
                            if (Is<SettingsServiceItemApiResponse>(response)) {
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

    if (hasGoods || forceUploadGoods) {
        const categoriesShort = await getGoodsCategoriesRequestAction(bearer, clientId, logger);
        categoriesShort.forEach((category) => {
            dataForCopy.goodsCopyData.categories.mapper[category.id] = {
                id             : category.id,
                title          : category.title,
                article        : '',
                comment        : '',
                isChainCategory: false,
                parent         : null,
                children       : [],
                goods          : [],
            };
        });

        const goods = await getGoodsSortByCategoriesRequestAction(bearer, clientId, categoriesShort.map((category) => category.id), logger);

        Object.entries(goods).forEach(([ categoryId, goodsList ]) => {
            if (dataForCopy.goodsCopyData.categories.mapper[categoryId]) {
                dataForCopy.goodsCopyData.categories.mapper[categoryId].goods = goodsList;
            }
        });
    }

    return dataForCopy;
};