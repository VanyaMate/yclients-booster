import {
    GroupLoyaltyCertificateMassAddItem,
    GroupLoyaltyCertificateTimeUnitType,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateMassAddForm/types/mass-add-certificate.types.ts';
import {
    GroupLoyaltyCertificateCreateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const convertFromCertificateInputToCreateData = async function (item: GroupLoyaltyCertificateMassAddItem, logger?: ILogger): Promise<GroupLoyaltyCertificateCreateData> {
    return {
        title                     : item.title,
        multi                     : item.type,
        balance                   : item.nominal,
        item_type_id              : item.limitationOfUse.type,
        allowed_service_ids       : item.limitationOfUse.services.join(','),
        expiration_type_id        : item.term.type,
        expiration_date           : item.term.date ?? '',
        expiration_timeout        : item.term.time?.amount ?? 0,
        expiration_timeout_unit_id: item.term.time?.type ?? GroupLoyaltyCertificateTimeUnitType.DAY,
        is_allow_empty_code       : item.allowEmptyCode ? 1 : 0,
        balance_edit_type_id      : item.balanceEditType,
        is_online_sale_enabled    : item.online ? 1 : 0,
        online_sale_title         : item.online?.title ?? '',
        online_sale_price         : item.online?.price ?? 0,
        online_sale_description   : item.online?.description ?? '',
        online_image              : item.online?.image
                                    ? await base64ImageLoad(item.online.image, logger)
                                    : '',
        salon_ids                 : item.salonIds.join(','),
        files                     : '',
        save                      : Date.now(),
        partial_update            : 0,
    };
};