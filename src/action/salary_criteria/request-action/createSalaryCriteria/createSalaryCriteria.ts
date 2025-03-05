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
    SalaryCriteriaCreateData, SalaryCriteriaFullData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    salaryCriteriaCreateDataToFormData,
} from '@/action/salary_criteria/convert/salaryCriteriaCreateDataToFormData.ts';


export const createSalaryCriteria = async function (
    clientId: string,
    createData: SalaryCriteriaCreateData,
    fetcher: IFetcher = new Fetch(),
    logger?: ILogger,
): Promise<SalaryCriteriaFullData> {
    logger?.log(`попытка создать критерий расчета ЗП "${ createData.title }" для клиента "${ clientId }"`);

    return fetcher.fetch(`https://yclients.com/salary_criteria/save/${ clientId }/0/?title=${ createData.title }`, {
        method: 'POST',
        body  : salaryCriteriaCreateDataToFormData(createData),
    })
        .then((response) => {
            if (response.ok) {
                console.log(response);
                logger?.success(`критерий расчета ЗП "${ createData.title }" для клиента "${ clientId }" успешно создан`);
                return response.json();
            }

            throw new Error(`ошибка ответа сервера: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`не удалость создать критерий расчета ЗП "${ createData.title }" для клиента "${ clientId }". Ошибка: ${ error.message }`);
            throw error;
        });
};