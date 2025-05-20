import {
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { convertToFormData } from '@/helper/lib/formdata/convertToFormData.ts';


// POST: https://yclients.com/finances/suppliers_save/1092329/0 FormData

export type FinancesSupplierUpdateData = {
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

export const updateFinancesSupplierRequestAction = async function (clientId: string, supplierId: string, updateData: FinancesSupplierUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<void> {
    logger?.log(`попытка изменить контрагента "${ updateData.title }" для клиента "${ clientId }"`);
    const body = convertToFormData({
        type   : updateData.type,
        title  : updateData.title,
        inn    : updateData.inn,
        kpp    : updateData.kpp,
        contact: updateData.contact,
        phone  : updateData.phone,
        email  : updateData.email,
        addr   : updateData.addr,
        comment: updateData.comment,
    });
    return fetcher.fetch(`https://yclients.com/finances/suppliers_save/${ clientId }/${ supplierId }?title=${ updateData.title }`, {
        method: 'POST',
        body,
    })
        .then(async (response) => {
            if (response.ok) {
                logger?.success(`контрагент "${ updateData.title }" клиента "${ clientId }" изменен`);
            } else {
                throw await response.json();
            }
        })
        .catch((error: Error) => {
            logger?.error(`контрагент "${ updateData.title }" клиента "${ clientId }" не изменен. ${ error.message }`);
            throw error;
        });
};