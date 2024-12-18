import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    ResourcesResponse,
} from '@/action/resources/types/resources-response.types.ts';


export const deleteResourceInstanceRequestAction = async function (resourceId: string, instanceId: string, logger?: ILogger): Promise<boolean> {
    logger?.log(`попытка удалить эксепляр "${ instanceId }" ресурса "${ resourceId }"`);

    return fetch(`https://yclients.com/resource_instances/delete/${ resourceId }/${ instanceId }`, {
        method: 'POST',
    })
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw new Error(`ошибка ответа. Статус: ${ response.status }`);
        })
        .then((response: ResourcesResponse) => {
            if (response.success) {
                logger?.success(`экземпляр "${ instanceId }" ресурса "${ resourceId }" удален`);
                return true;
            }

            throw new Error(`ошибка. ${ response.meta.message }`);
        })
        .catch((e: Error) => {
            logger?.error(`не удалить удалить экземпляр "${ instanceId }" ресурса "${ resourceId }". ${ e.message }`);
            throw e;
        });
};