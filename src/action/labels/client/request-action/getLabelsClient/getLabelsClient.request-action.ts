import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    LabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';
import { rgbToHex } from '@/helper/lib/color/rgbToHex.ts';


export const getLabelsClientRequestAction = function (clientId: string, logger?: ILogger): Promise<Array<LabelClientType>> {
    logger?.log(`Получение категорий клиентов для клиента "${ clientId }"`);

    return fetch(`https://yclients.com/labels/client/${ clientId }/`)
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            const labelList = [ ...dom.querySelectorAll<HTMLDivElement>(`.project-list table tbody > .client-box`) ];
            return labelList.map((label) => ({
                id    : label.querySelector('a')!.getAttribute('data-source-url')!.split('/').slice(-1)[0],
                title : label.querySelector('.label-name')!.textContent!.trim(),
                color : rgbToHex(label.querySelector('a')!.style.backgroundColor),
                icon  : label.querySelector('.fa')!.className.split('fa fa-')[1],
                entity: '1',
            }));
        })
        .then((list) => {
            logger?.success(`Найдено ${ list.length } категорий клиентов для клиента "${ clientId }"`);
            return list;
        })
        .catch((e) => {
            logger?.error(`Ошибка получения категорий клиентов для клиента "${ clientId }". ${ e?.message }`);
            throw e;
        });
};