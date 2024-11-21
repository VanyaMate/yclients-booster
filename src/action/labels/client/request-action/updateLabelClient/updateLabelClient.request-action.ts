import {
    ChangeLabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const updateLabelClientRequestAction = function (clientId: string, labelId: string, updateData: ChangeLabelClientType, logger?: ILogger): Promise<boolean> {
    const formData = new FormData();

    formData.append('entity', updateData.entity.toString());
    formData.append('title', updateData.title);
    formData.append('color', updateData.color);
    formData.append('icon', updateData.icon ?? '');

    logger?.log(`Попытка изменить категорию клиента "${ labelId }: ${ updateData.title }" для "${ clientId }"`);

    return fetch(`https://yclients.com/labels/save/${ clientId }/${ labelId }/`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`Категория клиента "${ labelId }: ${ updateData.title }" для "${ clientId }" изменена`);
                return true;
            } else {
                logger?.error(`Категория клиента "${ labelId }: ${ updateData.title }" для "${ clientId }" не изменена`);
                throw response.json();
            }
        });
};