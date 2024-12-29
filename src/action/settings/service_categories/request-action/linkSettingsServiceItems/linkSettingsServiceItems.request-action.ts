import {
    SettingsServiceLinksUpdateData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const linkSettingsServiceItemsRequestAction = async function (bearer: string, clientId: string, updateData: SettingsServiceLinksUpdateData, logger?: ILogger) {
    logger?.log(`попытка создания ссылок для "${ updateData.service_id }" для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/api/v1/company/1092329/services/links`, {
        method : 'POST',
        body   : JSON.stringify(updateData),
        headers: {
            'Authorization': `Bearer ${ bearer }`,
            'Content-Type' : 'application/json',
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`ссылоки для "${ updateData.service_id }" для клиента "${ clientId }" созданы`);
                return true;
            }

            throw new Error(`ошибка обновления ссылок. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`ошибка создания ссылок для "${ updateData.service_id }" для клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};