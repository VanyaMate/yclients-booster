import { IFetcher } from "@/service/Fetcher/Fetcher.interface";
import { ILogger } from "../_logger/Logger.interface";
import { Fetch } from "@/service/Fetcher/implementations/Fetch";
import { CreateClientType } from "./types/CreateClientType";
import { convertToFormData } from "@/helper/lib/formdata/convertToFormData";


export const getDefaultCreateClientType = function (): CreateClientType {
    return {
        additional_phone: '',
        bd_day: 0,
        bd_month: 0,
        bd_year: 0,
        card: '',
        comment: '',
        discount: '',
        email: '',
        fullname: '',
        importance: 0,
        money: '',
        paid_money: '',
        patronymic: '',
        phone: '',
        sex: 0,
        surname: ''
    }
}

export const createClientRequestAction = async function (clientId: string, createClientData: CreateClientType, fetcher: IFetcher = new Fetch(), logger?: ILogger) {
 // https://yclients.com/clients/addClient/1092329 POST
 // online_booking_ban 1
 // sex 0 1 2
 // importance 0 1 2 3
 // custom_fields[lybimiy-napitok-klienta]

    logger?.log(`попытка создать нового клиента "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}" для пользователя ${clientId}`);
    const formData = convertToFormData(createClientData);
    const labels = formData.get('labels[]');
    if (labels) {
        formData.delete('labels[]');
        labels.toString().split(',').forEach((label) => formData.append('labels[]', label));
    }

    return fetcher.fetch(`https://yclients.com/clients/addClient/${clientId}?name=${createClientData.fullname}&tel=${createClientData.phone}`, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
        }
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw response.json();
            }
        })
        .then((response) => {
            if (response.success) {
                logger?.success(`новый клиент "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}" для пользователя ${clientId} успешно создан`);
            } else {
                throw response;
            }
        })
        .catch((error: unknown) => {
            if (error instanceof Error) {
                logger?.error(`ошибка создания нового пользователя "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}". ${error.message}`);
            } else if (typeof error === 'object') {
                const err: any = error;
                const message = err?.meta?.message;
                const errors = err?.meta?.errors ?? {};
                if (message) {
                    logger?.error(`ошибка создания нового пользователя "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}". ${message}. ${convertErrorsToString(errors)}`);
                } else {
                    logger?.error(`ошибка создания нового пользователя "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}".`);
                }
            } else {
                logger?.error(`неизвестная ошибка создания нового пользователя "${createClientData.fullname} ${createClientData.patronymic} ${createClientData.surname}".`);
            }
            throw error;
        })
}

const convertErrorsToString = function (errors: Record<string, Array<string>> = {}) {
    return Object.entries(errors).map(([key, rows]) => `${key}: ${rows.map((row, index) => `${index + 1}. ${row}`).join(', ')}`);
}