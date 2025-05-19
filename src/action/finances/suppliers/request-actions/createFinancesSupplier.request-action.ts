import {
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


// POST: https://yclients.com/finances/suppliers_save/1092329/0 FormData

export type FinancesSupplierCreateData = {
    type: FinancesSupplierType,
    title: string,
    inn: string,
    kpp: string,
    contact: string,
    phone: string,
    email: string,
    addr: string,
    comment: string,
}

export const createFinancesSupplierRequestAction = async function (clientId: string, createData: FinancesSupplierCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<void> {
    logger?.log(`попытка создать контрагента "${ createData.title }" для клиента "${ clientId }"`);
    const body = convertToFormData(createData);
    return fetcher.fetch(`https://yclients.com/finances/suppliers_save/${ clientId }/0?title=${ createData.title }`, {
        method: 'POST',
        body,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`контрагент "${ createData.title }" для клиента "${ clientId }" создан`);
            } else {
                logger?.error(`контрагент "${ createData.title }" для клиента "${ clientId }" не создан`);
            }
        });
};