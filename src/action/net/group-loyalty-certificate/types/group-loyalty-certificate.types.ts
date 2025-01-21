export type GroupLoyaltyCertificateCreateData = {
    title: string;
    multi: number;
    balance: number;
    itemTypeId: number;
    /**
     * Массив из категорий (id) и услуг (id) - (объединить через ,)
     */
    allowedServiceIds: Array<string>;
    expirationTypeId: number;
    /**
     * 26.06.2014 формат
     */
    expirationDate: string;
    expirationTimeout: number;
    expirationTimeoutUnitId: number;
    isAllowEmptyCode: number;
    balanceEditTypeId: number;
    isOnlineSaleEnabled: number;
    onlineSaleTitle: string;
    onlineImage: string | null;
    onlineSaleDescription: string;
    files: null;
    onlineSalePrice: number;
    /**
     * Массив из салонов (id) - (объединить через ,)
     */
    salonIds: Array<string>;
    save: number;
    partialUpdate: number;
}