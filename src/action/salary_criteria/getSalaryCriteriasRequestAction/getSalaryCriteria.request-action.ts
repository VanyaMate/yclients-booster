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


const getSalaryCriteriaContextData = function (contextJson: string): SalaryCriteriaContext {
    try {
        const context                         = JSON.parse(contextJson);
        const categories                      = context?.services?.categories;
        const items                           = context?.services?.items;
        const response: SalaryCriteriaContext = {
            services: {
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
                        categoryId: category.category,
                        title     : '',
                        children  : [],
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
                        categoryId   : item.category,
                        categoryTitle: '',
                        itemId       : item.item,
                        title        : '',
                    });
                }
            }
        }

        return response;
    } catch (e) {
        throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_CONTEXT);
    }
};

export const getSalaryCriteriaRequestAction = function (clientId: string, criteriaId: string): Promise<SalaryCriteriaFullData> {
    return fetch(`https://yclients.com/salary_criteria/edit/${ clientId }/${ criteriaId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            const form = dom.querySelector('#salary_criteria_form');

            if (form) {
                const title             = form.querySelector<HTMLInputElement>('input[name="title"]');
                const period            = form.querySelector<HTMLSelectElement>('select[name="period_type"]');
                const criteriaContainer = form.querySelector('#criteria_items_container');

                if (title && period && criteriaContainer) {
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

            throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_DATA);
        });
};