import {
    ResourceCreateData,
} from '@/action/resources/types/resources.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    ResourcesResponse,
} from '@/action/resources/types/resources-response.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';


export const createResourceRequestAction = async function (clientId: string, createData: ResourceCreateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<boolean> {
    logger?.log(`создание ресурса "${ createData.title }" для клиента "${ clientId }"`);

    const formData = new FormData();
    formData.set('title', createData.title);
    formData.set('description', createData.description);

    return fetcher.fetch(`https://yclients.com/resources/save/${ clientId }/0?title=${ createData.title }`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа от сервера. ${ response.status }`);
        })
        .then((response: ResourcesResponse) => {
            if (response.success) {
                logger?.success(`ресурс "${ createData.title }" для клиента "${ clientId }" создан`);
                return true;
            }

            throw new Error(`не удалось создать ресурс. ${ response.meta.message }`);
        })
        .catch((e) => {
            logger?.error(`не удалось создать ресурс "${ createData.title }" для клиента "${ clientId }"`);
            throw e;
        });
};