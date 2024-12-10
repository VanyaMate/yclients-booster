import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    ResourceInstance,
    ResourceInstanceCreateData,
} from '@/action/resources/types/resources.types.ts';


// я растроен :(
export const createResourceInstanceRequestAction = async function (resourceId: string, createData: ResourceInstanceCreateData, logger?: ILogger): Promise<ResourceInstance> {
    logger?.log('tets');
    const formData = new FormData();
    formData.append('title', createData.title);
    return fetch(`https://yclients.com/resource_instances/save/${ resourceId }/0`, {
        method: 'POST', body: formData,
    })
        .then((response) => response.json())
        .then((data: ResourceInstance) => {
            console.log(data);
            return data;
        });
};