import {
    SalaryCriteriaShortData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getSalaryCriteriaListRequestAction = function (clientId: string, logger?: ILogger): Promise<Array<SalaryCriteriaShortData>> {
    logger?.log(`получение списка критериев расчета зарплат для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/salary_criteria/list/${ clientId }/`, { method: 'GET' })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            const criteriaLinks = [ ...dom.querySelectorAll<HTMLAnchorElement>(`.project-list table tbody tr .project-title a`) ];
            logger?.log(`есть ответ от сервера для списка критериев расчета зарплат для клиента "${ clientId }". Количество найденных критериев: ${ criteriaLinks.length }`);
            return criteriaLinks.map((link) => {
                return {
                    id   : link.pathname.split('/')[4],
                    title: link.textContent!.trim(),
                };
            });
        });
};