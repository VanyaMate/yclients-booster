// https://yclients.com/goods/delete/1092329/37393103/

import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const deleteGoodRequestAction = function (clientId: string, goodId: string, fetcher: IFetcher = new Fetch(), logger?: ILogger) {
    logger?.log(`попытка удалить товар "${ goodId }" клиента "${ clientId }"`);

    return fetcher.fetch(`https://yclients.com/goods/delete/${ clientId }/${ goodId }/`, {
        method: 'POST',
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`товар "${ goodId }" клиента "${ clientId }" удален`);
                return true;
            }
            throw new Error(response.statusText);
        })
        .catch((error) => {
            logger?.error(`товар "${ goodId }" клиента "${ clientId }" не удален. ${ error.message }`);
        });
};