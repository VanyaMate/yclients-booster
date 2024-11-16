export type SettingsServiceCategoryIdMapper = Record<string, SettingsServiceCategoryData>;
export type SettingsServiceCategoryItemIdMapper = Record<string, SettingsServiceData>;

export type SettingsServiceCategoryResponse = {
    list: Array<SettingsServiceCategoryDataWithChildren>;
    categoryMapper: SettingsServiceCategoryIdMapper;
    serviceMapper: SettingsServiceCategoryItemIdMapper;
}

export type SettingsServiceCategoriesApiResponse = {
    success: boolean;
    data: Array<SettingsServiceCategoryData>;
    meta: SettingsServiceCategoryApiResponseMeta;
}

export type SettingsServiceCategoryData = {
    id: number
    category_id: number
    salon_service_id: number
    title: string
    weight: number
    api_id: string
    staff: Array<number>
    booking_title: string
    price_min: number
    price_max: number
    sex: number
    is_chain: boolean
    services_count: number
}

export type SettingsServiceCategoryDataWithChildren =
    SettingsServiceCategoryData
    & {
    children: Array<SettingsServiceData>;
}

export type SettingsServiceCategoryApiResponseMeta = {
    total_count: number
}

export type SettingsServiceItemApiResponse = {
    success: boolean;
    data: Array<SettingsServiceData>;
    meta: SettingsServiceCategoryApiResponseMeta;
}

export type SettingsServiceData = {
    booking_title: string;
    tax_variant: any;                                       // TODO: Проверить что там должно быть
    vat_id: any;                                            // TODO: Проверить что там должно быть
    print_title: string;
    service_type: number;
    api_service_id: number;
    repeat_visit_days_step: any;                            // TODO: Проверить что там должно быть
    seance_search_start: number;
    seance_search_finish: number;
    seance_search_step: number;
    step: number;
    is_need_limit_date: boolean;
    date_from: string;
    date_to: string;
    schedule_template_type: number;
    online_invoicing_status: number;
    is_abonement_autopayment_enabled: number;
    autopayment_before_visit_time: number;
    abonement_restriction_value: number;
    is_chain: boolean;
    is_price_managed_only_in_chain: boolean;
    is_comment_managed_only_in_chain: boolean;
    price_prepaid_amount: number;
    price_prepaid_percent: number;
    is_composite: boolean;
    id: number;
    salon_service_id: number;
    title: string;
    category_id: number;
    price_min: number;
    price_max: number;
    discount: number;
    comment: string;
    weight: number;
    active: number;
    api_id: string;
    prepaid: string;
    is_multi: boolean;
    capacity: number;
    image_group: any[];                                     // TODO: Проверить что там должно быть
    staff: Array<SettingsServiceCategoryServiceStuff>;
    dates: any[];                                           // TODO: Проверить что там должно быть
    duration: number;
    resources: any[];                                       // TODO: Проверить что там должно быть
    is_online: boolean;
    composite_details: any;
}

export interface SettingsServiceCategoryServiceStuff {
    id: number;
    seance_length: number;
    technological_card_id: number;
    image_url: string;
    price: any;
    name: string;
}

export type SettingsServicesTree = Array<SettingsServiceCategoryDataWithChildren>;
export type SettingsServicesCategoriesMapper = Record<string, SettingsServiceCategoryData>;
export type SettingsServicesMapper = Record<string, SettingsServiceData>;