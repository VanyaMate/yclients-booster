import {
    FinancesExpense,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    getFinancesExpensesListDomAction,
} from '@/action/finances/expenses/dom-actions/getFinancesExpensesList.dom-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getFinancesExpensesListRequestAction = async function (clientId: string, logger?: ILogger): Promise<Array<FinancesExpense>> {
    logger?.log(`попытка получить список статей платежей клиента "${ clientId }"`);
    return fetch(`https://yclients.com/finances/expenses/list/${ clientId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(getFinancesExpensesListDomAction)
        .then((list) => {
            logger?.success(`список статей платежей (${ list.length }) клиента "${ clientId }" получен`);
            return list;
        })
        .catch((err: Error) => {
            logger?.error(`список статей платежей клиента "${ clientId }" не получен. ${ err.message }`);
            throw err;
        });
};