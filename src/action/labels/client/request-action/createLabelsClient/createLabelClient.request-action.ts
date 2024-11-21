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

    logger?.log(`Попытка создать лейбл "${ createData.title }" для "${ clientId }"`);

    return fetch(`https://yclients.com/labels/save/${ clientId }/0/`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`Лейбл "${ createData.title }" для "${ clientId }" создан`);
                return true;
            } else {
                logger?.error(`Лейбл "${ createData.title }" для "${ clientId }" не создан`);
                throw response.json();
            }
        });
};