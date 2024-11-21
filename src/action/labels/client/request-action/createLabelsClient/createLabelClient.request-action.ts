import {
    ChangeLabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const createLabelClientRequestAction = function (clientId: string, createData: ChangeLabelClientType, logger?: ILogger): Promise<boolean> {
    const formData = new FormData();

    formData.append('entity', createData.entity.toString());
    formData.append('title', createData.title);
    formData.append('color', createData.color);
    formData.append('icon', createData.icon ?? '');

    logger?.log(`Попытка создать категорию клиента "${ createData.title }" для "${ clientId }"`);

    return fetch(`https://yclients.com/labels/save/${ clientId }/0/`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`Категория клиента "${ createData.title }" для "${ clientId }" создана`);
                return true;
            } else {
                logger?.error(`Категория клиента "${ createData.title }" для "${ clientId }" не создана`);
                throw response.json();
            }
        });
};