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
    files: null;
    /**
     * Массив из салонов (id) - (объединить через ,)
     */
    salon_ids: string;
    save: number;
    partial_update: number;
}