import { Resource } from '@/action/resources/types/resources.types.ts';


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

export type SettingsServiceLinksUpdateData = {
    master_settings: Array<unknown>,
    resource_ids: Array<number>,
    service_id: number,
    translations: Array<SettingsServiceTranslation>;
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
    translations: Array<SettingsServiceTranslation>;
}

export type SettingsServiceTranslation = {
    language_id: number;
    translation: string;
}

export type SettingsServiceCategoryCreateData = {
    api_id: string,
    booking_title: string,
    services: Array<number>,
    service_count: number;
    staff: Array<number>,
    title: string,
    translations: Array<SettingsServiceTranslation>;
}

export type SettingsServiceImageGroup = {
    id: number;
    entity: string;
    entity_id: string,
    images: {
        basic: {
            id: number;
            path: string;
            width: string;
            height: string;
            type: string;
            image_group_id: number;
            version: string;
        }
    }
}

export type SettingsServiceItemUpdateData = {
    active: number;
    api_id: string;
    api_service_id: number;
    autopayment_before_visit_time: number;
    booking_title: string;
    capacity: number;
    category_id: number;
    comment: string;
    date_from: string; // format '1970-01-01'
    date_to: string; // format '1970-01-01'
    dates: Array<string>;
    delete_image: boolean; //  default: false // Если изменяется картинка -> true
    discount: number;
    duration: number;
    id: number;
    image?: string;
    image_group: null | SettingsServiceImageGroup;
    is_abonement_autopayment_enabled: number;
    is_category: false; // default: false
    is_chain: boolean;
    is_comment_managed_only_in_chain: boolean;
    is_composite: boolean;
    is_linked_to_composite: boolean;
    is_multi: boolean;
    is_need_limit_date: boolean;
    is_online: boolean;
    is_price_managed_only_in_chain: boolean;
    is_range_price_enabled: boolean; // price max !== price min
    kkm_settings_id: number;
    online_invoicing_status: number;
    price_max: number;
    price_min: number;
    price_prepaid_amount: number;
    price_prepaid_percent: number;
    print_title: string;
    prepaid: string;
    repeat_visit_days_step: number | null;
    resources: Array<number>;
    salon_group_service_link: null | string;
    salon_group_title: null | string;
    salon_service_id: number;
    schedule_template_type: number;
    seance_search_finish: number;
    seance_search_start: number;
    seance_search_step: number;
    service_type: number;
    staff: Array<number>;
    step: number;
    tax_variant: null | number;
    title: string;
    translations: Array<SettingsServiceTranslation>
    vat_id: null | number;
    weight: number;
}

export type SettingsServiceItemCreateData = {
    active: number;
    api_id: string;
    api_service_id: number;
    autopayment_before_visit_time: number;
    booking_title: string;
    capacity: number;
    category_id: number;
    chain_details: {
        is_comment_managed_only_in_chain: boolean;
        is_price_managed_only_in_chain: boolean;
        price_max: number;
        price_min: number;
        comment: string;
    };
    comment: string;
    date_from: string; // format '1970-01-01'
    date_to: string; // format '1970-01-01'
    dates: Array<string>;
    delete_image: boolean; //  default: false // Если изменяется картинка -> true
    discount: number;
    duration: number;
    id: number;
    image?: string;
    image_group: null | SettingsServiceImageGroup;
    is_abonement_autopayment_enabled: number;
    is_category: false; // default: false
    is_chain: boolean;
    is_comment_managed_only_in_chain: boolean;
    is_composite: boolean;
    is_linked_to_composite: boolean;
    is_multi: boolean;
    is_need_limit_date: boolean;
    is_online: boolean;
    is_price_managed_only_in_chain: boolean;
    is_range_price_enabled: boolean; // price max !== price min
    kkm_settings_id: number;
    online_invoicing_status: number;
    price_max: number;
    price_min: number;
    price_prepaid_amount: number;
    price_prepaid_percent: number;
    print_title: string;
    repeat_visit_days_step: number | null;
    resources: Array<number>;
    salon_group_service_link: null | string;
    salon_group_title: null | string;
    salon_service_id: number;
    schedule_template_type: number;
    seance_search_finish: number;
    seance_search_start: number;
    seance_search_step: number;
    service_type: number;
    staff: Array<number>;
    step: number;
    tax_variant: null | number;
    title: string;
    translations: Array<SettingsServiceTranslation>
    vat_id: null | number;
    weight: number;
}

export type SettingsServiceCategoryDataWithChildren =
    SettingsServiceCategoryData
    & {
        children: Array<SettingsServiceData>;
    }

export type SettingsServiceCategoryApiResponseMeta = {
    total_count: number
    message: string;
}

export type SettingsServiceItemApiResponse = {
    success: boolean;
    data: Array<SettingsServiceData>;
    meta: SettingsServiceCategoryApiResponseMeta;
}

export type SettingsServiceItemUpdateApiResponse = {
    success: boolean;
    data: SettingsServiceData;
    meta: SettingsServiceCategoryApiResponseMeta;
}

export type SettingsServiceData = {
    // запретить онлайн запись без абонемента (1 - да, 0/undefined - нет)
    // Запрет записи без абонемента (Только если online_invoicing_status=0)
    abonement_restriction_value: number;
    active: number;
    api_id: string;
    // Внешний идентификатор услуги
    api_service_id: number;
    // За какое время до визита производится автосписание
    autopayment_before_visit_time: number;
    // Название услуги для онлайн-записи
    booking_title: string;
    // вместимость
    capacity: number;
    // ID категории услуг
    category_id: number;
    // описание в онлайн-записи
    comment: string;
    // начало дней для записи в формате 2024-12-11
    date_from: string;
    // конец дней для записи в формате 2024-12-11
    date_to: string;
    // даты в формате 2024-12-11, 2024-12-13 итд
    dates: string[];
    // Скидка при оказании услуги
    discount: number;
    // длительность услуги в МС
    duration: number;
    id: number;
    image_group: null | SettingsServiceImageGroup;
    // Автосписание с абонемента (0 - нет, 1 - да)
    is_abonement_autopayment_enabled: number;
    // Отсносится к сети/не сети
    is_chain: boolean;
    is_comment_managed_only_in_chain: boolean;
    is_composite: boolean;
    is_linked_to_composite: boolean;
    // групповая - true, индивидуальная - false
    is_multi: boolean;
    // Ограничение по датам для онлайн-записи (boolean)
    is_need_limit_date: boolean;
    is_online: boolean;
    is_price_managed_only_in_chain: boolean;
    kkm_settings_id: null | number;
    // Онлайн-предоплата включена (0-выключена, 2-включена)
    online_invoicing_status: number;
    prepaid: string;
    price_max: number;
    price_min: number;
    // Сумма предоплаты
    price_prepaid_amount: number;
    // Размер предоплаты в процентах (от минимальной стоимости услуги)
    price_prepaid_percent: number;
    // запись в чеке
    print_title: string;
    // Уведомление о повторном визите (дней) (0 не отправлять, использовать
    // общие настройки)
    repeat_visit_days_step: number;
    // ресурсы
    resources: Array<number>;
    salon_group_service_link: null | string;
    salon_group_title: null | string;
    salon_service_id: number;
    schedule_template_type: number;
    // Время в МС до которого доступна запись
    seance_search_finish: number;
    // Время в МС с которого начаинается запись
    seance_search_start: number;
    // Время в МС шаг записей (900 - 15м)
    seance_search_step: number;
    // Доступна ли для онлайн записи услуга. 1 - доступна, 0 не доступна.
    service_type: number;
    staff: Array<SettingsServiceCategoryServiceStuff>;
    step: number;
    // ID системы налогообложения (number)
    // -1 - По умолчанию
    // 0 - Общая ОСН
    // 1 - Упрощенная УСН (Доход)
    // 2 - Упрощенная УСН (Доход минус Расход)
    // 3 - Единый налог на вмененный доход ЕНВД
    // 4 - Единый сельскохозяйственный налог ЕСН
    // 5 - Патентная система налогообложения
    tax_variant: number | null;
    // Название услуги
    title: string;
    // переводы (языки)
    translations: Array<SettingsServiceTranslation>;
    // ID НДС
    // 4 - Не облагается
    // 3 - 20% НДС
    // 2 - 10% НДС
    // 1 - 0% НДС
    // -1 - По умолчанию
    vat_id: number | null;
    // Вес услуги (используется для сортировки услуг при отображении)
    weight: number;
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

export type SettingsServiceEditData = {
    title?: string;
    price_min: number;
    price_max: number;
    technological_card_id?: string;
    length_hour?: number;
    length_minute?: number;
};

export type SettingsServiceMassEditRecordData = Record<string, SettingsServiceEditData>;


export type SettingsServicesTree = Array<SettingsServiceCategoryDataWithChildren>;
export type SettingsServicesCategoriesMapper = Record<string, SettingsServiceCategoryData>;
export type SettingsServicesMapper = Record<string, SettingsServiceData>;

export type SettingsServiceCopyData = {
    tree: SettingsServicesTree;
    categoriesMapper: SettingsServicesCategoriesMapper;
    servicesMapper: SettingsServicesMapper;
    resources: Array<Resource>;
}