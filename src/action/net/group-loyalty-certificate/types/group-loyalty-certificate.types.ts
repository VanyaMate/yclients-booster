export type GroupLoyaltyCertificateCreateData = {
    title: string;
    multi: number;
    balance: number;
    item_type_id: number;
    /**
     * Массив из категорий (id) и услуг (id) - (объединить через ,)
     */
    allowed_service_ids: string;
    expiration_type_id: number;
    /**
     * 26.06.2014 формат
     */
    expiration_date: string;
    expiration_timeout: number;
    expiration_timeout_unit_id: number;
    is_allow_empty_code: number;
    balance_edit_type_id: number;
    is_online_sale_enabled: number;
    online_sale_title: string;
    online_image: string | null;
    online_sale_description: string;
    online_sale_price: number;
    files: '';
    /**
     * Массив из салонов (id) - (объединить через ,)
     */
    salon_ids: string;
    save: number;
    partial_update: number;
}

export type GroupLoyaltyCertificateData = {
    title: string;
    multi: number;
    balance: number;
    category_id: number;
    item_type_id: number;
    /**
     * Массив из категорий (id) и услуг (id) - (объединить через ,)
     */
    allowed_service_ids: string;
    expiration_type_id: number;
    /**
     * 26.06.2014 формат
     */
    expiration_date: string;
    expiration_timeout: number;
    expiration_timeout_unit_id: number;
    is_allow_empty_code: number;
    balance_edit_type_id: number;
    is_online_sale_enabled: number;
    online_sale_title: string;
    online_image: string | null;
    online_sale_description: string;
    online_sale_price: number;
    files: '';
    /**
     * Массив из салонов (id) - (объединить через ,)
     */
    salon_ids: string;
    save: number;
    partial_update: number;
}

export type GroupLoyaltyCertificateUpdateData = {
    title: string;
    multi: number;
    balance: number;
    category_id: number;
    item_type_id: number;
    /**
     * Массив из категорий (id) и услуг (id) - (объединить через ,)
     */
    allowed_service_ids: string;
    expiration_type_id: number;
    /**
     * 26.06.2014 формат
     */
    expiration_date: string;
    expiration_timeout: number;
    expiration_timeout_unit_id: number;
    is_allow_empty_code: number;
    balance_edit_type_id: number;
    is_online_sale_enabled: number;
    online_sale_title: string;
    online_image: string | null;
    online_sale_description: string;
    online_sale_price: number;
    files: '';
    /**
     * Массив из салонов (id) - (объединить через ,)
     */
    salon_ids: string;
    save: number;
    partial_update: number;
}

export type GroupLoyaltyCertificateShortData = {
    title: string;
    id: string;
}

export type GroupLoyaltyCeriticateApiResponseItem = {
    balance: number;
    balance_edit_type_id: number;
    category_id: number | null;
    company_group_id: number;
    date_archived: boolean | null;
    expiration_date: number | string;
    expiration_timeout: number;
    expiration_timeout_unit_id: number;
    expiration_type_id: number;
    id: number;
    is_allow_empty_code: boolean;
    is_archived: boolean;
    is_multi: boolean;
    is_serial_number_limited: boolean;
    item_type: { id: number, title: string };
    item_type_id: number;
    online_sale_description: string;
    online_sale_image: string | null;
    online_sale_is_enabled: boolean;
    online_sale_price: number;
    online_sale_title: string;
    released_total: number;
    salon_ids: Array<number>;
    service_ids: Array<number>
    title: string;
    weight: number;
}

export type GroupLoyaltyCertificateApiResponse = {
    data: Array<GroupLoyaltyCeriticateApiResponseItem>;
    meta: {
        total_count: number;
    },
    success: boolean;
}