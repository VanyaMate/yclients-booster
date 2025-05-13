import {
    SalaryCriteriaContext,
    SalaryCriteriaFullData,
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    ERROR_SALARY_CRITERIA_CANNOT_GET_CONTEXT,
    ERROR_SALARY_CRITERIA_CANNOT_GET_DATA,
    ERROR_SALARY_CRITERIA_CANNOT_GET_RULES,
} from '@/action/salary_criteria/errors/salary-criteria.errors.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


const getSalaryCriteriaContextData = function (contextJson: string): SalaryCriteriaContext {
    try {
        const context         = JSON.parse(contextJson);
        const categories      = context?.services?.categories;
        const items           = context?.services?.items;
        const goodsCategories = context?.goods?.categories;
        const goodsItems      = context?.goods?.items;

        if (!(categories?.length || items?.length || goodsCategories?.length || goodsItems?.length)) {
            return {};
        }

        const response: SalaryCriteriaContext = {
            services: {
                categories: [],
                items     : [],
            },
            goods   : {
                categories: [],
                items     : [],
            },
        };

        let category: any;
        if (categories) {
            for (let i = 0; i < categories.length; i++) {
                category = categories[i];
                if (category?.category) {
                    response.services?.categories.push({
                        category: category.category,
                    });
                }
            }
        }

        let item: any;
        if (items) {
            for (let i = 0; i < items.length; i++) {
                item = items[i];
                if (item?.category && item?.item) {
                    response.services?.items.push({
                        category: item.category,
                        item    : item.item,
                    });
                }
            }
        }

        let goodCategory: any;
        if (goodsCategories) {
            for (let i = 0; i < goodsCategories.length; i++) {
                goodCategory = goodsCategories[i];
                if (goodCategory?.category) {
                    response.goods?.categories.push({
                        category: goodCategory.category,
                    });
                }
            }
        }

        let goodItem: any;
        if (goodsItems) {
            for (let i = 0; i < goodsItems.length; i++) {
                goodItem = goodsItems[i];
                if (goodItem?.category && goodItem?.item) {
                    response.goods?.items.push({
                        category: goodItem.category,
                        item    : goodItem.item,
                    });
                }
            }
        }

        return response;
    } catch (e) {
        throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_CONTEXT);
    }
};

export const getSalaryCriteriaRequestAction = function (clientId: string, criteriaId: string, logger?: ILogger): Promise<SalaryCriteriaFullData> {
    logger?.log(`получение полных данных для критерия "${ criteriaId }" для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/salary_criteria/edit/${ clientId }/${ criteriaId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            logger?.log(`есть ответ от сервера для критерия "${ criteriaId }" для клиента "${ clientId }"`);
            const form = dom.querySelector('#salary_criteria_form');

            if (form) {
                logger?.success(`ответ от сервера для критерия "${ criteriaId }" для клиента "${ clientId }" содержит форму`);
                const title             = form.querySelector<HTMLInputElement>('input[name="title"]');
                const period            = form.querySelector<HTMLSelectElement>('select[name="period_type"]');
                const criteriaContainer = form.querySelector('#criteria_items_container');

                if (title && period && criteriaContainer) {
                    logger?.success(`ответ от сервера для критерия "${ criteriaId }" для клиента "${ clientId }" содержит основные поля`);
                    const criteriaList                         = [ ...criteriaContainer.querySelectorAll<HTMLTableRowElement>(`tr.criteria_item_row`) ];
                    const rules: Array<SalaryCriteriaRuleData> = [];

                    let criteria: HTMLTableRowElement | null = null;
                    let id: string | null                    = null;
                    let useNetCost: string | null            = null;
                    let individualType: string | null        = null;
                    let targetType: string | null            = null;
                    let useDiscount: string | null           = null;
                    let amount: string | null                = null;
                    let contextJson: string | null           = null;

                    for (let i = 0; i < criteriaList.length; i++) {
                        criteria       = criteriaList[i];
                        id             = criteria.getAttribute('data-item_id');
                        useNetCost     = criteria.querySelector<HTMLSelectElement>(`select[name="criteria_items[${ id }][use_net_cost]"]`)?.value ?? null;
                        individualType = criteria.querySelector<HTMLSelectElement>(`select[name="criteria_items[${ id }][is_aggregate_individual]"]`)?.value ?? null;
                        targetType     = criteria.querySelector<HTMLSelectElement>(`select[name="criteria_items[${ id }][targets_type]"]`)?.value ?? null;
                        useDiscount    = criteria.querySelector<HTMLSelectElement>(`select[name="criteria_items[${ id }][use_discount]"]`)?.value ?? null;
                        amount         = criteria.querySelector<HTMLInputElement>(`input[name="criteria_items[${ id }][amount]"]`)?.value ?? null;
                        contextJson    = criteria.querySelector<HTMLInputElement>(`input[name="criteria_items[${ id }][context]"]`)?.value ?? null;

                        if (
                            id !== null &&
                            useNetCost !== null &&
                            individualType !== null &&
                            targetType !== null &&
                            useDiscount !== null &&
                            amount !== null &&
                            contextJson !== null
                        ) {
                            rules.push({
                                id,
                                useNetCost,
                                useDiscount,
                                individualType,
                                targetType,
                                context: getSalaryCriteriaContextData(contextJson),
                                amount,
                            });
                        } else {
                            logger?.error(`ошибка "${ ERROR_SALARY_CRITERIA_CANNOT_GET_RULES }" для критерия "${ criteriaId }" для клиента "${ clientId }"`);
                            throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_RULES);
                        }
                    }

                    return {
                        id    : criteriaId,
                        title : title.value,
                        period: period.value,
                        rules : rules,
                    };
                }
            }

            logger?.error(`ошибка "${ ERROR_SALARY_CRITERIA_CANNOT_GET_DATA }" для критерия "${ criteriaId }" для клиента "${ clientId }"`);
            throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_DATA);
        });
};