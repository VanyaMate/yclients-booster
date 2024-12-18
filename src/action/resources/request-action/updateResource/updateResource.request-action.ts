import {
    Resource,
    ResourceUpdateData,
} from '@/action/resources/types/resources.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    ResourcesResponse,
} from '@/action/resources/types/resources-response.types.ts';


export const updateResourceRequestAction = async function (clientId: string, resourceId: string, updateData: ResourceUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<Resource> {
    logger?.log(`обновление ресурса "${ resourceId }" клиента "${ clientId }"`);

    const formData = new FormData();
    formData.set('title', updateData.title);
    formData.set('description', updateData.description);

    return fetcher.fetch(`https://yclients.com/resources/save/${ clientId }/${ resourceId }`, {
        method: 'POST',
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`неправильный запрос. Статус: ${ response.status }`);
        })
        .then((response: ResourcesResponse) => {
            if (response.success) {
                logger?.success(`ресурс "${ resourceId }" клиента ${ clientId } обновлен`);

                return {
                    id         : resourceId,
                    title      : updateData.title,
                    description: updateData.description,
                    instances  : [],
                };
            }

            throw new Error(`ошибка. ${ response.meta.message }`);
        })
        .catch((e: Error) => {
            logger?.error(`ресурс "${ resourceId }" клиента "${ clientId }" обновить не получилось. ${ e.message }`);

            throw e;
        });
};