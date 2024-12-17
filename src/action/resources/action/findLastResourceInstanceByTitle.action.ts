import { ResourceInstance } from '@/action/resources/types/resources.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const findLastResourceInstanceByTitleAction = async function (instances: Array<ResourceInstance>, title: string, logger?: ILogger): Promise<ResourceInstance> {
    logger?.log(`поиск экземляра ресурса по заголовку "${ title }"`);

    for (let i = instances.length - 1; i >= 0; i--) {
        if (instances[i].title === title) {
            logger?.success(`экземляр ресурса по заголовку "${ title }" найден`);
            return instances[i];
        }
    }

    logger?.error(`экземляр ресурса по заголовку "${ title }" не найден`);
    throw new Error(`экземляр ресурса по заголовку "${ title }" не найден`);
};