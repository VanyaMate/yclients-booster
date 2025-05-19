import {
    FinancesSupplier,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import { stringToDom } from '@/helper/lib/dom/stringToDom.ts';
import {
    getFinancesSuppliersFromTableDomAction,
} from '@/action/finances/suppliers/dom-actions/getFinancesSuppliersFromTable.dom-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';

// GET: https://yclients.com/finances/suppliers_search/1092329

type Response = {
    content: string,
    count: number;
    error: string;
    extra_data: string;
    paging: string;
    success: boolean;
}

export const getFinancesSuppliersRequestAction = async function (clientId: string, logger?: ILogger): Promise<Array<FinancesSupplier>> {
    let count: number = 0;
    logger?.log(`получение списка контрагентов клиента "${ clientId }"`);

    const getSuppliers = async function (page: number, list: Array<FinancesSupplier>): Promise<Array<FinancesSupplier>> {
        logger?.log(`получение страницы "${ page }" контрагентов клиента "${ clientId }"`);
        return fetch(`https://yclients.com/finances/suppliers_search/${ clientId }?page=${ page }`)
            .then((response) => response.json())
            .then((response: Response) => {
                count = response.count;
                logger?.log(`всего контрагентов у клиента "${ clientId }" - ${ count }`);
                return stringToDom(response.content);
            })
            .then(getFinancesSuppliersFromTableDomAction)
            .then((suppliers) => {
                if (suppliers.length) {
                    logger?.log(`получено "${ suppliers.length }" контрагентов со страницы "${ page }" клиента "${ clientId }"`);
                    list = list.concat(suppliers);
                    if (list.length !== count) {
                        return getSuppliers(page + 1, list);
                    }
                }
                if (list.length !== count) {
                    logger?.warning(`получено ${ list.length }/${ count } контрагентов клиента "${ clientId }"`);
                } else {
                    logger?.success(`получено ${ list.length }/${ count } контрагентов клиента "${ clientId }"`);
                }
                return list;
            });
    };

    return getSuppliers(1, []);
};