import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    LabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';


export const getLabelsClientRequestAction = function (clientId: string, logger?: ILogger): Promise<Array<LabelClientType>> {
    logger?.log(`Получение категории клиентов для клиента "${ clientId }"`);

    return fetch(`https://yclients.com/labels/client/${ clientId }/`)
        .then(fetchResponseToDom)
        .then((dom: Document) => {

        });
};