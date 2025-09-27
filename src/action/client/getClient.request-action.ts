import { ILogger } from "../_logger/Logger.interface";
import { ClientType } from "./types/ClientType";

export const getClientRequestAction = async function (clientId: string, logger?: ILogger): Promise<ClientType> {
    logger?.log(`попытка получить информацию о клиенте "${clientId}"`);
    
    return fetch(`https://yclients.com/clients/getClientInfo/${clientId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    .then((response) => {
        if (response.ok) {
            logger?.success(`информация о клиенте "${clientId}" получена`);
            return response.json();
        }
        throw response.json();
    })
    .catch((error) => {
        logger?.error(`информация о клиенте "${clientId}" не получена`);
        throw error;
    })
}