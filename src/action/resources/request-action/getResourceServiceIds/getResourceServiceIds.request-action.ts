import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const getResourceServiceIdsRequestAction = async function (clientId: string, resourceId: string, logger?: ILogger): Promise<Array<string>> {
    logger?.log(`получение списка id услуг прикрепленных к ресурсу "${ resourceId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/resources/edit/${ clientId }/${ resourceId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom) => {
            const form = dom.querySelector('#resources-form');

            if (form) {
                const select = form.querySelector<HTMLSelectElement>('select[name="service_ids[]"]');

                if (select) {
                    const { selectedOptions } = select;

                    logger?.success(`список id услуг прикрепленных к ресурсу "${ resourceId }" клиента "${ clientId }" получен`);
                    return [ ...selectedOptions ].map((select) => select.value);
                }

                throw new Error('select не найден');
            }

            throw new Error('форма не найдена');
        })
        .catch((error: Error) => {
            logger?.error(`список id услуг прикрепленных к ресурсу "${ resourceId }" клиента "${ clientId }" получен. ${ error.message }`);
            throw error;
        });
};