import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    getStuffListDomAction,
    StuffItem,
} from '@/action/settings/stuff/getStuffList.dom-action.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const getStuffListRequestAction = function (clientId: string, logger?: ILogger): Promise<Array<StuffItem>> {
    logger?.log(`получение списка сотрудников клиента "${ clientId }"`);

    return fetch(`https://yclients.com/settings/filial_staff/${ clientId }?position_id=-1&fired=2&deleted=2&user_linked=2&is_paid=2`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(getStuffListDomAction)
        .then((list) => {
            logger?.success(`сотрудника клиента "${ clientId }" успешно получены`);
            return list;
        })
        .catch((error) => {
            logger?.error(`сотрудника клиента "${ clientId }" не получены. ${ error.message }`);
            throw error;
        });
};