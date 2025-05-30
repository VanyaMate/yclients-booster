export type GroupLoyaltyAbonementCreateData = {
    title: string;
    salon_group_id: number;
    cost: number;
    period: number;
    period_unit_id: number;
    allow_freeze: boolean;
    freeze_limit: number | null;
    freeze_limit_unit_id: number;
    is_booking_when_frozen_allowed: boolean;
    service_price_correction: boolean;
    expiration_type_id: number;
    is_allow_empty_code: boolean;
    is_united_balance: boolean;
    united_balance_services_count: number;
    balance_edit_type_id: number;
    is_online_sale_enabled: boolean;
    online_sale_title: string;
    online_sale_description: string;
    online_sale_price: number;
    online_image: string | null;
    delete_online_image: boolean;
    auto_activation_time_in_days: number;
    autoactivation_time_unit_id: number;
    is_archived: boolean;
    autoactivation_period: number;
    salon_ids: Array<number>;
    availability: Array<GroupLoyaltyAbonementAvailability>;
    service_rows: Array<GroupLoyaltyAbonementServiceRow>;
    services: GroupLoyaltyAbonementServices;
    service_categories: GroupLoyaltyAbonementServiceCategories;
}

export type GroupLoyaltyAbonementUpdateData =
    GroupLoyaltyAbonementCreateData
    & {
        category_id: null;
        weight: null;
    };

export type Abonement = {
    id: number
    salon_group_id: number
    category_id: any
    title: string
    period: number
    period_unit_id: number
    allow_freeze: boolean
    freeze_limit: number
    freeze_limit_unit_id: number
    is_booking_when_frozen_allowed: boolean
    is_allow_empty_code: boolean
    is_united_balance: boolean
    united_balance_services_count: number
    is_code_required: boolean
    balance_edit_type_id: number
    cost: number
    is_archived: boolean
    date_archived: any
    expiration_type_id: number
    expiration_type_title: string
    service_price_correction: boolean
    is_online_sale_enabled: boolean
    online_sale_title: string
    online_sale_description: string
    online_sale_price: number
    autoactivation_time: number
    autoactivation_time_unit_id: number
    weight: number
    balance_container: AbonementBalanceContainer
    abonements_count: number
    attached_salon_ids?: number[]
}

export type AbonementBalanceContainer = {
    links: AbonementLink[]
}

export type AbonementLink = {
    count: number
    service?: AbonementService
    category?: AbonementCategory
}

export type AbonementService = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    is_chain?: boolean
    chain_price_min?: number
    chain_price_max?: number
    category: AbonementCategory
}

export type AbonementCategory = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    is_chain?: boolean
    chain_price_min?: number
    chain_price_max?: number
    category: AbonementSubCategory
}

export type AbonementSubCategory = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    category: any[]
}

export type GroupLoyaltyAbonementServiceRow = {
    key: number;
    serviceId: number;
    categoryId: number;
    count: number;
}

export type GroupLoyaltyAbonementAvailability = {
    week_days: Array<number>;
    intervals: Array<GroupLoyaltyAbonementInterval>;
}

export type GroupLoyaltyAbonementInterval = {
    from: number;
    to: number;
}

export type GroupLoyaltyAbonementServices = Record<string, number>;
export type GroupLoyaltyAbonementServiceCategories = Record<string, number>;

export type GroupLoyaltyFullDataResponse = {
    id: number
    salon_group_id: number
    category_id: any
    title: string
    period: number
    period_unit_id: number
    allow_freeze: boolean
    freeze_limit: number
    freeze_limit_unit_id: number
    is_booking_when_frozen_allowed: boolean
    is_allow_empty_code: boolean
    is_united_balance: boolean
    united_balance_services_count: number
    is_code_required: boolean
    balance_edit_type_id: number
    cost: number
    is_archived: boolean
    date_archived: any
    expiration_type_id: number
    expiration_type_title: string
    service_price_correction: boolean
    is_online_sale_enabled: boolean
    online_sale_title: string
    online_sale_description: string
    online_sale_price: number
    autoactivation_time: number
    autoactivation_time_unit_id: number
    weight: number
    balance_container: GroupLoyaltyFullDataResponseBalanceContainer
    attached_salon_ids: number[]
    online_sale_image: any
    availability: any[]
}

export type GroupLoyaltyFullDataResponseService = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    online_sale_title: string
    is_chain: boolean
    chain_price_min: number
    chain_price_max: number
    category: GroupLoyaltyFullDataResponseCategory
}

export type GroupLoyaltyFullDataResponseBalanceContainer = {
    links: Array<GroupLoyaltyFullDataResponseLink>
}

export type GroupLoyaltyFullDataResponseLink =
    {
        count: number
        category?: GroupLoyaltyFullDataResponseCategory
        service?: GroupLoyaltyFullDataResponseService
    };

export type GroupLoyaltyFullDataResponseCategory = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    online_sale_title: string
    is_chain: boolean
    chain_price_min: number
    chain_price_max: number
    category: GroupLoyaltyFullDataResponseRootCategory
}

export type GroupLoyaltyFullDataResponseRootCategory = {
    id: number
    category_id: number
    is_category: boolean
    title: string
    online_sale_title: string
    category: any[]
}