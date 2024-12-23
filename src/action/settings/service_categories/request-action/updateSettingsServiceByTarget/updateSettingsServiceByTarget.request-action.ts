import {
    SettingsServiceData,
    SettingsServiceItemUpdateApiResponse,
    SettingsServiceItemUpdateData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';


export const updateSettingsServiceByTargetRequestAction = async function (bearer: string, clientId: string, clientData: SettingsServiceData, targetData: SettingsServiceData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<SettingsServiceData> {
    logger?.log(`обновление услуги "${ clientData.id }" "${ clientData.title }" клиента "${ clientId }"`);

    const composeData: SettingsServiceItemUpdateData = {
        ...clientData,
        ...targetData,
        id                      : clientData.id,
        category_id             : clientData.category_id,
        image_group             : targetData.image_group,
        image                   : targetData.image_group?.images?.basic?.path
                                  ? await base64ImageLoad(targetData.image_group.images.basic.path, logger)
                                  : undefined,
        delete_image            : !!targetData.image_group?.images?.basic?.path,
        is_category             : false,
        is_range_price_enabled  : targetData.price_max > targetData.price_min,
        kkm_settings_id         : 0,
        staff                   : clientData.staff.map((staff) => staff.id),
        resources               : clientData.resources,
        salon_service_id        : clientData.salon_service_id,
        salon_group_service_link: clientData.salon_group_service_link,
        salon_group_title       : clientData.salon_group_title,
        api_id                  : clientData.api_id,
        api_service_id          : clientData.api_service_id,
        is_chain                : false,
    };

    return fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/services/${ clientData.id }`, {
        method : 'PATCH',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
        body   : JSON.stringify(composeData),
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`ошибка ответа. Статус: ${ response.status }`);
            }
        })
        .then((response: SettingsServiceItemUpdateApiResponse) => {
            if (response.success) {
                logger?.success(`услуга "${ clientData.id }" "${ clientData.title }" клиента "${ clientId }" обновлена`);
                return response.data;
            }

            throw new Error(`ошибка обновления. ${ response.meta.message }`);
        })
        .catch((e: Error) => {
            logger?.error(`не получилось обновить услугу "${ clientData.id }" "${ clientData.title }" клиента "${ clientId }". ${ e.message }`);
            throw e;
        });
};