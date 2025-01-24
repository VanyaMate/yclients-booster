import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const removeSettingsServiceRequestAction = async function (bearer: string, clientId: string, serviceId: string, logger?: ILogger): Promise<void> {
    logger?.log(`попытка удалить сервис "${ serviceId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/company/${ clientId }/services/${ serviceId }`, {
        method : 'DELETE',
        headers: {
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`сервис "${ serviceId }" клиента "${ clientId }" удален`);
                return;
            }

            throw new Error(`ошибка ответа с сервера. Статус: ${ response.status }`);
        })
        .catch((error: Error) => {
            logger?.error(`не удалось удалить сервис "${ serviceId }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};