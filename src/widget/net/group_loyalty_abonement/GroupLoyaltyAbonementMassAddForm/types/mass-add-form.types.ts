export type GroupLoyaltyAbonementServiceAmount = {
    categoryId: string;
    serviceId: string;
    count: number;
}

export enum GroupLoyaltyAbonementTimeUnitType {
    DAY   = '1',
    WEEK  = '2',
    MONTH = '3',
    YEAR  = '4'
}

export type GroupLoyaltyAbonementTimeUnit = {
    amount: number;
    type: GroupLoyaltyAbonementTimeUnitType;
}

export type GroupLoyaltyAbonementFreezing = {
    time: GroupLoyaltyAbonementTimeUnit;
    unlimited: boolean;
    bookingAllow: boolean;
}

export enum GroupLoyaltyAbonementActivationType {
    PURCHASE,
    VISIT,
    DATE
}

export type GroupLoyaltyAbonementActivation = {
    type: GroupLoyaltyAbonementActivationType;
    time: GroupLoyaltyAbonementTimeUnit | null;
}

export enum GroupLoyaltyAbonementSalonChangeType {
    NONE,
    PURCHASE,
    ALL
}

export type GroupLoyaltyAbonementAddItem = {
    // Любой текст
    title: string;
    // 10000
    price: number;
    // 30д
    validityPeriod: GroupLoyaltyAbonementTimeUnit;
    // да-неогр-онл да-30д да-1г-онл да нет
    freezing: GroupLoyaltyAbonementFreezing | null;
    // продажа посещение посещение-30д дата
    activation: GroupLoyaltyAbonementActivation;
    // 20 нет
    visitAmount: number | null;
    // catId-amount,catId-amount,catId
    categories: Array<GroupLoyaltyAbonementServiceAmount>;
    // catId-serId-amount,catId-serId-amount,catId-serId
    services: Array<GroupLoyaltyAbonementServiceAmount>;
    // да нет
    recalculateAfterPayment: boolean;
    // да нет
    isNamedType: boolean;
    // да нет
    online: boolean;
    // 1092329,557451
    salonIds: Array<string>;
    // нет гдепродан везде
    salonChangeType: GroupLoyaltyAbonementSalonChangeType;
}