// https://yclients.com/finances/expenses_save/1092329/0 POST
// FORMDATA title, type, comment

import {
    FinancesExpenseCreateData,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


export const createFinancesExpenseRequestAction = async function (clientId: string, createData: FinancesExpenseCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<void> {
    logger?.log(`попытка создать статью платежей "${ createData.title }" клиента "${ clientId }"`);
    return fetcher.fetch(`https://yclients.com/finances/expenses_save/${ clientId }/0?t=${ createData.title }`, {
        method: 'POST',
        body  : convertToFormData({
            title  : createData.title,
            comment: createData.comment,
            type   : createData.type,
        }),
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`статья платежей "${ createData.title }" клиента "${ clientId }" создана`);
                return;
            } else {
                throw new Error(response.statusText);
            }
        })
        .catch((err: Error) => {
            logger?.error(`статья платежей "${ createData.title }" клиента "${ clientId }" не создана. ${ err.message }`);
        });
};