export interface GroupLoyaltyAbonementCreateData {
    title: string;
    salon_group_id: number;
    cost: number;
    salon_ids: any[];
    period: number;
    period_unit_id: number;
    allow_freeze: boolean;
    freeze_limit: number;
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
    online_image: any;
    delete_online_image: boolean;
    auto_activation_time_in_days: number;
    autoactivation_time_unit_id: number;
    is_archived: boolean;
    service_rows: ServiceRow[];
    availability: Availability[];
    autoactivation_period: number;
    services: Services;
    service_categories: ServiceCategories;
}

export interface ServiceRow {
    key: number;
    serviceId: number;
    categoryId: number;
    count: number;
}

export interface Availability {
    week_days: number[];
    intervals: Interval[];
}

export interface Interval {
    from: number;
    to: number;
}

export interface Services {
    '17055503': number;
    '17055505': number;
    '17055506': number;
}

export interface ServiceCategories {
    '16588852': number;
}
