import {
    GroupLoyaltyAbonementAddItem,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/types/mass-add-form.types.ts';
import {
    GroupLoyaltyAbonementCreateData,
} from '@/action/net/group-loyalty-abonement/types/types.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const convertFromInputToCreateData = async function (data: GroupLoyaltyAbonementAddItem, salonId: string, logger?: ILogger): Promise<GroupLoyaltyAbonementCreateData> {
    const freezeLimit = data.freezing ? data.freezing.unlimited ? null
                                                                : data.freezing.time.amount
                                      : null;


    return {
        title                         : data.title,
        cost                          : data.price,
        period                        : data.validityPeriod.amount,
        period_unit_id                : data.validityPeriod.type,
        allow_freeze                  : !!data.freezing,
        freeze_limit                  : freezeLimit,
        freeze_limit_unit_id          : data.freezing?.time.type ?? 1,
        is_booking_when_frozen_allowed: data.freezing?.bookingAllow ?? true,
        expiration_type_id            : data.activation.type,
        auto_activation_time_in_days  : data.activation.time?.amount ?? 0,
        autoactivation_period         : data.activation.time?.amount ?? 0,
        autoactivation_time_unit_id   : data.activation.time?.type ?? 1,
        is_united_balance             : !!data.visitAmount,
        united_balance_services_count : !!data.visitAmount ? data.visitAmount
                                                           : data.services.reduce((acc, service) => acc + service.count, 0) + data.categories.reduce((acc, category) => acc + category.count, 0),
        services                      : data.services.reduce((acc, service) => {
            acc[service.serviceId] = service.count;
            return acc;
        }, {} as Record<string, number>),
        service_categories            : data.categories.reduce((acc, service) => {
            acc[service.categoryId] = service.count;
            return acc;
        }, {} as Record<string, number>),
        service_rows                  : [ ...data.services, ...data.categories ].map((item) => ({
            key: Math.floor(Math.random() * 1000000),
            ...item,
        })),
        service_price_correction      : data.recalculateAfterPayment,
        is_allow_empty_code           : data.isNamedType,
        is_online_sale_enabled        : !!data.online,
        online_sale_title             : data.online?.title ?? data.title,
        online_image                  : data.online?.image
                                        ? await base64ImageLoad(data.online.image, logger)
                                        : null,
        online_sale_price             : data.online?.price ?? data.price,
        online_sale_description       : data.online?.description ?? '',
        delete_online_image           : false,
        salon_ids                     : data.salonIds,
        balance_edit_type_id          : data.salonChangeType,

        //
        availability  : [],
        is_archived   : false,
        salon_group_id: Number(salonId),
    };
};