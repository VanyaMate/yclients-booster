import {
    SettingsServiceEditData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateSettingsServiceByMassEditRequestAction = async function (bearer: string, clientId: string, serviceId: string, data: SettingsServiceEditData, logger?: ILogger): Promise<boolean> {
    const body: SettingsServiceEditData = {
        price_min: data.price_min,
        price_max: data.price_max,
    };

    if (data.technological_card_id !== undefined) {
        body.technological_card_id = data.technological_card_id;
    }

    if (data.length_hour !== undefined) {
        body.length_hour = data.length_hour;
    }

    if (data.length_minute !== undefined) {
        body.length_minute = data.length_minute;
    }

    logger?.log(`обновление данных услуги "${ serviceId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/settings/services_mass_edit_save/${ clientId }/${ serviceId }`, {
        method : 'POST',
        body   : JSON.stringify(body),
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                logger?.error(`не получилось обновить данные услуги "${ serviceId }" клиента "${ clientId }"`);
                throw new Error('Ошибка получения данных');
            }
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`данные услуги "${ serviceId }" клиента "${ clientId }" обновлены`);
                return true;
            } else {
                logger?.error(`не получилось обновить данные услуги "${ serviceId }" клиента "${ clientId }". ${ response?.meta?.message }`);
                throw new Error(response.data);
            }
        })
        .catch((e) => {
            logger?.error(`не получилось обновить данные услуги "${ serviceId }" клиента "${ clientId }". ${ JSON.stringify(e.message) }`);
            throw e;
        });
};