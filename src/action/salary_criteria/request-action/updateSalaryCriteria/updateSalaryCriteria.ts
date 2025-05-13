/**
 *
 * UPDATE
 * https://yclients.com/salary_criteria/save/1092329/47187/ POST FormData
 *
 * title: Test
 * period_type: 0
 * criteria_items[57896][context]: {"goods":{"categories":[{"category":"1360511"}],"items":[]},"services":{"categories":[{"category":17364733},{"category":17364730}],"items":[{"category":18023621,"item":18023622}]}}
 * criteria_items[57896][id]: 57896
 * criteria_items[57896][use_net_cost]: 2
 * criteria_items[57896][is_aggregate_individual]: 0
 * criteria_items[57896][targets_type]: 2
 * criteria_items[57896][amount]: 123
 * criteria_items[57896][use_discount]: 0
 * criteria_items[57897][context]: {"goods":{"items":[{"category":"1360512","item":"33336145"}],"categories":[]}}
 * criteria_items[57897][id]: 57897
 * criteria_items[57897][use_net_cost]: 2
 * criteria_items[57897][is_aggregate_individual]: 0
 * criteria_items[57897][targets_type]: 2
 * criteria_items[57897][amount]: 23
 * criteria_items[57897][use_discount]: 0
 *
 */

/**
 * CREATE
 * https://yclients.com/salary_criteria/save/1092329/0/ POST FormData
 *
 *
 * title: Test
 * period_type: 0
 * criteria_items[0][context]: {"goods":{"categories":[{"category":"1360511","item":0}],"items":[]},"services":{"categories":[{"category":17364733,"item":0},{"category":17364730,"item":0}],"items":[{"category":18023621,"item":18023622}]}}
 * criteria_items[0][id]: 0
 * criteria_items[0][use_net_cost]: 2
 * criteria_items[0][is_aggregate_individual]: 0
 * criteria_items[0][targets_type]: 2
 * criteria_items[0][amount]: 123
 * criteria_items[0][use_discount]: 0
 * criteria_items[new_1][id]:
 * criteria_items[new_1][context]: {"goods":{"categories":[],"items":[{"category":"1360512","item":"33336145"}]}}
 * criteria_items[new_1][use_net_cost]: 2
 * criteria_items[new_1][is_aggregate_individual]: 0
 * criteria_items[new_1][targets_type]: 2
 * criteria_items[new_1][amount]: 11
 * criteria_items[new_1][use_discount]: 0
 *
 */
import {
    SalaryCriteriaFullData, SalaryCriteriaUpdateData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    salaryCriteriaUpdateDataToFormData,
} from '@/action/salary_criteria/convert/salaryCriteriaUpdateDataToFormData.ts';


export const updateSalaryCriteria = async function (
    clientId: string,
    criteriaId: string,
    updateData: SalaryCriteriaUpdateData,
    fetcher: IFetcher = new Fetch(),
    logger?: ILogger,
): Promise<SalaryCriteriaFullData> {
    console.log('updateSalaryCriteria', criteriaId, updateData);

    logger?.log(`попытка обновить критерий расчета ЗП "${ criteriaId }" "${ updateData.title }" для клиента "${ clientId }"`);

    return fetcher.fetch(`https://yclients.com/salary_criteria/save/${ clientId }/${ criteriaId }/?title=${ updateData.title }`, {
        method: 'POST',
        body  : salaryCriteriaUpdateDataToFormData(updateData),
    })
        .then((response) => {
            if (response.ok) {
                console.log(response);
                logger?.success(`критерий расчета ЗП "${ updateData.title }" для клиента "${ clientId }" успешно обновлен`);
                return response.json();
            }

            throw new Error(`ошибка ответа сервера: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`не удалость обновить критерий расчета ЗП "${ updateData.title }" для клиента "${ clientId }". Ошибка: ${ error.message }`);
            throw error;
        });
};