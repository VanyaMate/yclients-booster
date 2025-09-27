export type UpdateClientDefaultType = {
    client_id: string;
    fullname: string;
    patronymic: string;
    surname: string;
    phone: string;
    additional_phone: string;
    email: string;
    'labels[]': string;
    sex: number | string;
    importance: number | string;
    discount: number | string;
    card: string;
    bd_day: number | string;
    bd_month: number | string;
    bd_year: number | string;
    comment: string;
    edit_spent: number | string; // 1 - da, 0 - net
    spent: number | string;      // skolko
    edit_paid: number | string;
    paid: number | string;
    balance: number | string;    // balance - spent
    image: string;
    text: string;
    is_personal_data_processing_allowed: number | string;
    is_newsletter_allowed: number | string;
};

export type UpdateClientType = Record<string, string | number> & UpdateClientDefaultType;