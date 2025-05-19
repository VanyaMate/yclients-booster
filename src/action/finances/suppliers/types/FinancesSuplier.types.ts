export enum FinancesSupplierType {
    YR  = 0,
    IP  = 1,
    FIZ = 2,
}

export type FinancesSupplier = {
    id: string;
    type: FinancesSupplierType,
    title: string,
    inn: string,
    kpp: string,
    contact: string,
    phone: string,
    email: string,
    addr: string,
    comment: string
}