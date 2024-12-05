import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    SettingsServiceMassEditRecordData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const getSettingsServicesByMassEditRequestAction = async function (clientId: string, logger?: ILogger): Promise<SettingsServiceMassEditRecordData> {
    logger?.log(`получение настроек услуг для клиента "${ clientId }"`);
    return fetch(`https://yclients.com/settings/services_mass_edit/${ clientId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom) => {
            const response: SettingsServiceMassEditRecordData = {};

            const container = dom.querySelector(`#page-wrapper .wrapper .table tbody.ocp_services`);

            if (container) {
                const services = container.querySelectorAll('.service-row');

                services.forEach((service) => {
                    const id: string | null                = service.getAttribute('sid');
                    const title: string | undefined        = service.querySelector('.service-title-cell a')?.textContent!.trim();
                    const priceMin: string | undefined     = service.querySelector<HTMLInputElement>('input[name="price_min"]')?.value;
                    const priceMax: string | undefined     = service.querySelector<HTMLInputElement>('input[name="price_max"]')?.value;
                    const lengthHours: string | undefined  = service.querySelector<HTMLSelectElement>('select[name="length_hour"]')?.value;
                    const lengthMinute: string | undefined = service.querySelector<HTMLSelectElement>('select[name="length_minute"]')?.value;
                    const techCard: string | undefined     = service.querySelector<HTMLSelectElement>('select[name="technological_card_id"]')?.value;

                    if (
                        id !== null &&
                        title !== undefined &&
                        priceMin !== undefined &&
                        priceMax !== undefined
                    ) {
                        response[id] = {
                            title                : title,
                            price_min            : Number(priceMin),
                            price_max            : Number(priceMax),
                            length_hour          : lengthHours
                                                   ? Number(lengthHours)
                                                   : undefined,
                            length_minute        : lengthMinute
                                                   ? Number(lengthMinute)
                                                   : undefined,
                            technological_card_id: techCard,
                        };
                    }
                });

                logger?.success(`получено ${ services.length } услуг для клиента "${ clientId }"`);
            }

            return response;
        })
        .catch((e) => {
            logger?.error(`услуги для клиента "${ clientId }" не получены`);
            throw e;
        });
};