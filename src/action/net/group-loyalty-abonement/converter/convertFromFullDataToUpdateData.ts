import {
    GroupLoyaltyAbonementUpdateData, GroupLoyaltyFullDataResponse,
} from '@/action/net/group-loyalty-abonement/types/types.ts';


export const convertFromFullDataToUpdateData = function (data: GroupLoyaltyFullDataResponse): GroupLoyaltyAbonementUpdateData {
    return {
        title                         : data.title,
        salon_ids                     : data.attached_salon_ids,
        allow_freeze                  : data.allow_freeze,
        auto_activation_time_in_days  : data.autoactivation_time,
        autoactivation_period         : data.autoactivation_time,
        autoactivation_time_unit_id   : data.autoactivation_time_unit_id,
        availability                  : data.availability,
        balance_edit_type_id          : data.balance_edit_type_id,
        category_id                   : null,
        cost                          : data.cost,
        delete_online_image           : false,
        expiration_type_id            : data.expiration_type_id,
        freeze_limit                  : data.freeze_limit,
        freeze_limit_unit_id          : data.freeze_limit_unit_id,
        is_allow_empty_code           : data.is_allow_empty_code,
        is_archived                   : data.is_archived,
        is_booking_when_frozen_allowed: data.is_booking_when_frozen_allowed,
        is_online_sale_enabled        : data.is_online_sale_enabled,
        is_united_balance             : data.is_united_balance,
        online_image                  : null,
        online_sale_description       : data.online_sale_description,
        online_sale_price             : data.online_sale_price,
        online_sale_title             : data.online_sale_title,
        period                        : data.period,
        period_unit_id                : data.period_unit_id,
        salon_group_id                : data.salon_group_id,
        service_categories            : data.balance_container.links
            .filter((item) => item.category)
            .reduce((ids, category) => ({
                ...ids, [category.category!.id]: category.count,
            }), ({})),
        service_price_correction      : data.service_price_correction,
        service_rows                  : data.balance_container.links
            .map((serviceOrCategory) => ({
                categoryId: serviceOrCategory.category
                            ? serviceOrCategory.category.id
                            : serviceOrCategory!.service?.category_id!,
                count     : serviceOrCategory.count,
                key       : Math.floor(Math.random() * 10_000_000),
                serviceId : serviceOrCategory?.category ? 0
                                                        : serviceOrCategory.service!.id,
            })),
        services                      : data.balance_container.links
            .filter((item) => item.service)
            .reduce((ids, service) => ({
                ...ids, [service!.service!.id!]: service.count,
            }), ({})),
        united_balance_services_count : data.united_balance_services_count,
        weight                        : null,
    };
};