export type CreateClientDefaultType = {
    fullname: string;
    patronymic: string;
    surname: string;
    phone: string;
    additional_phone: string;
    email: string;
    sex: number;
    importance: number;
    discount: string;
    card: string;
    bd_day: number;
    bd_month: number;
    bd_year: number;
    comment: string;
    money: string;
    paid_money: string;
}

export type ClientWithPhoneType = {
    phone: string;
    id: number;
}

export type CreateClientType = Record<string, string | number> & CreateClientDefaultType; 