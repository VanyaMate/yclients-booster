// https://yclients.com/finances/expenses_save/1092329/123123 POST
// FORMDATA title, type, comment

import {
    FinancesExpenseUpdateData,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


export const updateFinancesExpenseRequestAction = async function (clientId: string, expenseId: string, updateData: FinancesExpenseUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<void> {
    logger?.log(`попытка изменить статью платежей "${ expenseId } - ${ updateData.title }" клиента "${ clientId }"`);
    return fetcher.fetch(`https://yclients.com/finances/expenses_save/${ clientId }/${ expenseId }?title=${ updateData.title }&t=${ updateData.type }&c=${ updateData.comment }`, {
        method: 'POST',
        body  : convertToFormData({
            title  : updateData.title,
            comment: updateData.comment,
            type   : updateData.type,
        }),
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`статья платежей "${ expenseId } - ${ updateData.title }" клиента "${ clientId }" изменена`);
                return;
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch((err: Error) => {
            logger?.error(`статья платежей "${ expenseId } - ${ updateData.title }" клиента "${ clientId }" не изменена. ${ err.message }`);
        });
};