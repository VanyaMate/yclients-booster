export enum GroupLoyaltyCertificateDebitType {
    ONE  = 0,
    MANY = 1
}

export enum GroupLoyaltyCertificateLimitationOfUseType {
    SERVICES_AND_GOODS         = 0,
    SERVICES                   = 1,
    GOODS                      = 2,
    PART_OF_SERVICES           = 3,
    PART_OF_SERVICES_AND_GOODS = 4
}

export enum GroupLoyaltyCertificateTimeUnitType {
    DAY   = 1,
    WEEK  = 2,
    MONTH = 3,
    YEAR  = 4
}

export enum GroupLoyaltyCertificateExpirationType {
    NONE = 0,
    DATE = 1,
    TERM = 2
}

export enum GroupLoyaltyCertificateBalanceEditType {
    NONE     = 0,
    PURCHASE = 1,
    ALL      = 2
}

export type GroupLoyaltyCertificateLimitationOfUse = {
    type: GroupLoyaltyCertificateLimitationOfUseType;
    services: Array<string>;
}

export type GroupLoyaltyCertificateTimeUnit = {
    amount: number;
    type: GroupLoyaltyCertificateTimeUnitType;
}

export type GroupLoyaltyCertificateTerm = {
    type: GroupLoyaltyCertificateExpirationType;
    date: string | null;
    time: GroupLoyaltyCertificateTimeUnit | null;
}

export type GroupLoyaltyCertificateOnline =
    {
        title: string;
        description: string;
        price: number;
        image: string;
    }
    | null;

export type GroupLoyaltyCertificateMassAddItem = {
    title: string;
    type: GroupLoyaltyCertificateDebitType;
    nominal: number;
    limitationOfUse: GroupLoyaltyCertificateLimitationOfUse;
    term: GroupLoyaltyCertificateTerm;
    allowEmptyCode: boolean;
    balanceEditType: GroupLoyaltyCertificateBalanceEditType;
    online: GroupLoyaltyCertificateOnline;
    salonIds: Array<string>;
}