import {
    createSettingsServiceItemRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceItem/createSettingsServiceItem.request-action.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';


export const createSettingsServiceItemByTargetRequestAction = async function (bearer: string, clientId: string, categoryId: number, targetData: SettingsServiceData, resources: Array<number>, fetcher: IFetcher = new Fetch(), logger ?: ILogger): Promise<SettingsServiceData> {
           return createSettingsServiceItemRequestAction(
               bearer,
               clientId,
               {
                   ...targetData,
                   chain_details           : {
                       comment                         : '',
                       is_comment_managed_only_in_chain: false,
                       is_price_managed_only_in_chain  : false,
                       price_max                       : 0,
                       price_min                       : 0,
                   },
                   delete_image            : false,
                   is_category             : false,
                   category_id             : categoryId,
                   is_linked_to_composite  : targetData.is_linked_to_composite,
                   is_range_price_enabled  : targetData.price_min !== targetData.price_max,
                   kkm_settings_id         : 0,
                   salon_group_title       : '',
                   salon_group_service_link: '',
                   salon_service_id        : 0,
                   translations            : targetData.translations.filter((translation) => translation.translation),
                   resources               : resources, // CREATE TOO
                   staff                   : [],
                   image_group             : targetData.image_group,
                   image                   : targetData.image_group?.images?.basic?.path
                                             ? await base64ImageLoad(targetData.image_group.images.basic.path, logger)
                                             : undefined,
                   id                      : 0,
                   vat_id                  : -1,
                   tax_variant             : -1,
                   is_chain                : false,
               },
               fetcher,
               logger,
           );
       }
;