import { ILogger } from '@/action/_logger/Logger.interface.ts';


export type StuffFullItem = {
    id: string;
    name: string;
    is_fired: boolean;
    is_online: boolean;
}

export const getStuffListFromApiRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<Array<StuffFullItem>> {
    logger?.log(`получение списка сотрудников клиента "${ clientId }"`);

    return fetch(`https://yclients.com/api/v1/company/${ clientId }/staff/users`, {
        method : 'GET',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => response.json())
        .then((response) => response.data.masters)
        .then((masters) => {
            logger?.success(`сотрудники клиента "${ clientId }" успешно получены`);
            return masters;
        })
        .catch((error) => {
            logger?.error(`сотрудники клиента "${ clientId }" не получены. ${ error.message }`);
            throw error;
        });
};