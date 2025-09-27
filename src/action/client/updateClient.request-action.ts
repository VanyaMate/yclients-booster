import { IFetcher } from "@/service/Fetcher/Fetcher.interface"
import { UpdateClientDefaultType, UpdateClientType } from "./types/UpdateClientType"
import { Fetch } from "@/service/Fetcher/implementations/Fetch"
import { ILogger } from "../_logger/Logger.interface"
import { convertToFormData } from "@/helper/lib/formdata/convertToFormData"

export const getDefaultUpdateClientType = function (clientId: string): UpdateClientDefaultType {
    return {
        additional_phone: '',
        bd_day: 0,
        bd_month: 0,
        bd_year: 0,
        card: '',
        comment: '',
        discount: 0,
        email: '',
        fullname: '',
        importance: 0,
        patronymic: '',
        phone: '',
        sex: 0,
        surname: '',
        "labels[]": '',
        balance: 0,
        client_id: clientId,
        edit_paid: 0,
        edit_spent: 0,
        image: '',
        is_newsletter_allowed: 0,
        is_personal_data_processing_allowed: 0,
        paid: 0,
        spent: 0,
        text: '',
    }
}

export const updateClientRequestAction = async function (updateClientData: UpdateClientType, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<boolean> {
    logger?.log(`попытка обновить клиента "${updateClientData.client_id}"`);
    
    const formData = convertToFormData(updateClientData);
    const labels = formData.get('labels[]');
    if (labels) {
        formData.delete('labels[]');
        labels.toString().split(',').forEach((label) => formData.append('labels[]', label));
    }

    return fetcher.fetch(`https://yclients.com/clients/saveClient/?clientId=${updateClientData.client_id}`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/javascript, */*; q=0.01',
        },
        body: formData
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`клиент "${updateClientData.client_id}" обновлен`);
                return true;
            }
            throw response.json();
        })
        .catch((error) => {
            logger?.error(`клиент "${updateClientData.client_id}" не обновлен. ${error.message}`);
            throw error;
        })
}