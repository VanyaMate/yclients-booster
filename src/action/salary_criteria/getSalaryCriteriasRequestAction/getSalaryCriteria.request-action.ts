import {
    SalaryCriteriaFullData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    ERROR_SALARY_CRITERIA_CANNOT_GET_DATA,
} from '@/action/salary_criteria/errors/salary-criteria.errors.ts';


export const getSalaryCriteriaRequestAction = function (clientId: string, criteriaId: string): Promise<SalaryCriteriaFullData> {
    return fetch(`https://yclients.com/salary_criteria/edit/${ clientId }/${ criteriaId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            // TODO: Получение IDs

            throw new Error(ERROR_SALARY_CRITERIA_CANNOT_GET_DATA);
        });
};