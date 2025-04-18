import {
    GoodCategoriesCopyData,
} from '@/action/goods/list/types/goods-category.types.ts';


export type GoodData = {
    id: string;
    title: string;
    print_title: string;
    article: string;
    barcode: string;
    category_id: number;
    sale_unit_id: number;
    unit_equals: string;
    service_unit_id: number;
    netto: string;
    brutto: string;
    cost: string;
    actual_cost: string;
    tax_variant: number;
    vat_id: number;
    critical_amount: string;
    desired_amount: string;
    comment: string;
}

export type GoodUpdateData = Omit<GoodData, 'id'>;

export type GoodCreateData = Omit<GoodData, 'id'>;


export type GoodsCopyData = {
    goods: Array<GoodData>;
    categories: GoodCategoriesCopyData;
}

export type GoodApiResponseItem = {
    title: string;
    value: string;
    label: string;
    article: string;
    category: string;
    category_id: number;
    salon_id: number;
    good_id: number;
    cost: number;
    unit_id: number;
    unit_short_title: string;
    service_unit_id: number;
    service_unit_short_title: string;
    actual_cost: number;
    unit_actual_cost: number;
    unit_actual_cost_format: string;
    unit_equals: number;
    barcode: string;
    is_chain: boolean;
    comment: string;
    loyalty_abonement_type_id: number;
    loyalty_certificate_type_id: number;
    loyalty_allow_empty_code: number;
    loyalty_serial_number_limited: number;
    actual_amounts: GoodActualAmount[];
    critical_amount: number;
    desired_amount: number;
    last_change_date: string;
    is_goods_mark_enabled: boolean;
    loyalty_expiration_type_id: any;
};

export type GoodApiResponseData = Array<GoodApiResponseItem>;

export type GoodActualAmount = {
    storage_id: number;
    amount: number;
}