import {
    FinancesExpense,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { Converter } from '@/converter/Converter.ts';


export const getFinancesExpensesListDomAction = function (dom: Document): Array<FinancesExpense> {
    const table = dom.querySelector('.ibox-content table.table');

    if (table) {
        const rows = table.querySelectorAll('tr.client-box');
        return [ ...rows ]
            .map((row) => {
                const actionElement = row.querySelector<HTMLAnchorElement>(`.project-actions > a`);
                if (actionElement) {
                    const titleElement = row.querySelector('.project-title');
                    const typeElement  = row.querySelector('td:nth-child(3)');

                    if (titleElement && typeElement) {
                        const link    = titleElement.querySelector<HTMLAnchorElement>('a')!;
                        const id      = actionElement.href.split('/').pop()!;
                        const title   = link.textContent!.trim();
                        const comment = titleElement.querySelector('small')!.textContent!.trim() ?? '';
                        const type    = typeElement.textContent!.trim();

                        return {
                            id,
                            title,
                            comment,
                            type: Converter.Finances.Expenses.labelToType(type),
                        };
                    }
                }
                return null;
            })
            .filter((item) => item !== null);
    }

    return [];
};