import {
    SalaryCriteriaShortData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    fetchResponseToDom
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const getSalaryCriteriaListRequestAction = function (clientId: string): Promise<Array<SalaryCriteriaShortData>> {
    return fetch(`https://yclients.com/salary_criteria/list/${ clientId }/`, { method: 'GET' })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            const criteriaLinks = [ ...dom.querySelectorAll<HTMLAnchorElement>(`.project-list table tbody tr .project-title a`) ];
            return criteriaLinks.map((link) => {
                return {
                    id   : link.pathname.split('/')[4],
                    title: link.textContent!.trim(),
                };
            });
        });
};