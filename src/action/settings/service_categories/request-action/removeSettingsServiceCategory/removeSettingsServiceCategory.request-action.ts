import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const removeSettingsServiceCategoryRequestAction = async function (bearer: string, clientId: string, categoryId: string, logger?: ILogger): Promise<void> {
    logger?.log(`попытка удалить категорию "${ categoryId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/company/${ clientId }/service_categories/${ categoryId }`, {
        method : 'DELETE',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`категория "${ categoryId }" клиента "${ clientId }" удален`);
                return;
            }

            throw new Error(`ошибка ответа с сервера. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`не удалось удалить категорию "${ categoryId }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};