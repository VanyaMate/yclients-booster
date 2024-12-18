import {
    ResourceInstance,
    ResourceInstanceUpdateData,
} from '@/action/resources/types/resources.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';


export const updateResourceInstanceRequestAction = async function (resourceId: string, instanceId: string, updateData: ResourceInstanceUpdateData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<ResourceInstance> {
    logger?.log(`обновление данных эксемляра "${ instanceId }" ресурса "${ resourceId }"`);

    const formData = new FormData();
    formData.set('title', updateData.title);

    return fetcher.fetch(`https://yclients.com/resource_instances/save/${ resourceId }/${ instanceId }`, {
        method: `POST`,
        body  : formData,
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`данные эксемляра "${ instanceId }" ресурса "${ resourceId }" обновлены`);

                return {
                    id   : instanceId,
                    title: updateData.title,
                };
            } else {
                throw new Error(`ошибка обновления`);
            }
        })
        .catch((e: Error) => {
            logger?.error(`не получилось обновить данных эксемляра "${ instanceId }" ресурса "${ resourceId }". ${ e.message }`);
            throw e;
        });
};