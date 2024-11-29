import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    SettingsServiceItemCreateData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const createSettingsServiceItemRequestAction = function (bearer: string, clientId: string, createData: SettingsServiceItemCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger) {
    logger?.log(`создание новой услуги ${ fetcher }`);
    return fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/services`, {
        method : 'POST',
        body   : JSON.stringify(createData),
        headers: {
            'Authorization': `Bearer ${ bearer }`,
            'Content-Type' : 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`новая услуга "${ createData.title }" для "${ clientId }" создана`);
            } else {
                logger?.error(`новая услуга "${ createData.title }" для "${ clientId }" не создана`);
            }
            return response.json();
        })
        .then((response) => response.data)
        .catch((e) => {
            logger?.error(`новая услуга "${ createData.title }" для "${ clientId }" не создана`);
            throw e;
        });
};