export type SettingsServiceMassivePriceUpdateItemData = {
    id: string;
    price_min: number;
    price_max: number;
}

export type SettingsServiceMassivePriceUpdateData = Array<SettingsServiceMassivePriceUpdateItemData>;

export type SettingsServiceMassivePriceUpdateCompareDataItem = {
    id: string;
    title: string;
    price_min: {
        before: number;
        after: number;
    },
    price_max: {
        before: number;
        after: number;
    },
    technological_card_id?: string;
    length_hour?: number;
    length_minute?: number;
}

export type SettingsServiceMassivePriceUpdateCompareData = Record<string, SettingsServiceMassivePriceUpdateCompareDataItem>;