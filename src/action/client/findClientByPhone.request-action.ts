import { ILogger } from "../_logger/Logger.interface"

export const findClientByPhoneRequestAction = async function (bearer: string, clientId: string, phone: string, logger?: ILogger): Promise<boolean> {
    return await fetch(`https://yclients.com/api/v1/company/${clientId}/clients/search`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${bearer}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page: 1,
            page_size: 1,
            filters: [{
                type: 'quick_search',
                state: {
                    value: phone
                }
            }]
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
                return true;
            }

            throw new Error(`ошибка ответа. ${JSON.stringify(response)}`);
        })
        .catch((error) => {
            logger?.error(`не получилось получить список клиентов. ${error.message}`);
            throw error;
        });
}