import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    ResourceInstanceCreateData,
} from '@/action/resources/types/resources.types.ts';
import {
    ResourcesResponse,
} from '@/action/resources/types/resources-response.types.ts';


export const createResourceInstanceRequestAction = async function (resourceId: string, createData: ResourceInstanceCreateData, logger?: ILogger): Promise<boolean> {
    logger?.log(`создание экземпляра ресурса "${ createData.title }" для "${ resourceId }"`);

    const formData = new FormData();
    formData.append('title', createData.title);

    return fetch(`https://yclients.com/resource_instances/save/${ resourceId }/0`, {
        method: 'POST', body: formData,
    })
        .then((response) => response.json())
        .then((data: ResourcesResponse) => {
            if (data.success) {
                logger?.success(`экземпляра ресурса "${ createData.title }" для "${ resourceId }" создан`);
                return data.success;
            } else {
                logger?.error(`экземпляра ресурса "${ createData.title }" для "${ resourceId }" не создан`);
                throw new Error(`экземпляра ресурса "${ createData.title }" для "${ resourceId }" не создан`);
            }
        })
        .catch((e) => {
            logger?.error(`экземпляра ресурса "${ createData.title }" для "${ resourceId }" не создан`);
            throw e;
        });
};