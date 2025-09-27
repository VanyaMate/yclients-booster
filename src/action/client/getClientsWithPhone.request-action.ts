import { ILogger } from "../_logger/Logger.interface";
import { ClientWithPhoneType } from "./types/CreateClientType";

export const getClientsWithPhoneRequestAction = async function (bearer: string, clientId: string, logger?: ILogger): Promise<Array<ClientWithPhoneType>> {
    const clients: Array<ClientWithPhoneType> = [];
    let clientsAmount: number = 0;
    let page: number = 1;

    await fetch(`https://yclients.com/api/v1/company/${clientId}/clients/search`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: 1,
            page_size: 1
        })
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response.json();
        })
        .then((response) => {
            if (response.success) {
                if (Number.isInteger(response.meta?.total_count)) {
                    clientsAmount = response.meta.total_count;
                    return;
                }

                throw new Error("в ответе отсутствует информация о количестве клиентов");
            }

            throw new Error(`ошибка ответа. ${JSON.stringify(response)}`);
        })
        .catch((error) => {
            logger?.error(`не получилось получить список клиентов. ${error.message}`);
            throw error;
        });

    while (clientsAmount > clients.length) {
        await fetch(`https://yclients.com/api/v1/company/${clientId}/clients/search`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearer}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                page,
                page_size: 100,
                fields: ['phone']
            })
        })  
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response.json();
        })
        .then((response) => {
            if (response.success) {
                clients.push(...response.data);
                page += 1;
                return;
            }

            throw new Error(`ошибка ответа. ${JSON.stringify(response)}`);
        })
        .catch((error) => {
            logger?.error(`не получилось получить список клиентов со страницы ${page}. ${error.message}`);
            throw error;
        });
    }
    

    return clients;
}