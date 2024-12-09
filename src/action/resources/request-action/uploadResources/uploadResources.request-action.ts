import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Resource } from '@/action/resources/types/resources.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    uploadResourceInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourceInstances/uploadResourceInstances.request-action.ts';


export const uploadResourcesRequestAction = async function (clientId: string, logger?: ILogger): Promise<Array<Resource>> {
    logger?.log(`получение ресурсов клиента "${ clientId }"`);
    return fetch(`https://yclients.com/resources/${ clientId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(async (dom) => {
            const table = dom.querySelector(`.page-table > .project-list > table > tbody`);
            if (table) {
                const resourcesRows              = [ ...table.querySelectorAll('.client-box') ];
                const resources: Array<Resource> = [];

                let resourceRow;
                let link;
                let descriptionElement;
                let id;
                let resourceInstances;
                for (let i = 0; i < resourcesRows.length; i++) {
                    resourceRow        = resourcesRows[i];
                    link               = resourceRow.children[1]?.querySelector('a');
                    descriptionElement = resourceRow.children[2];

                    if (link && descriptionElement) {
                        id                = link.href.split('/').slice(-1)[0];
                        resourceInstances = await uploadResourceInstancesRequestAction(id, logger);
                        resources.push({
                            id         : id,
                            title      : link.textContent!.trim(),
                            description: descriptionElement.textContent!.trim(),
                            instances  : resourceInstances,
                        });
                    }
                }

                logger?.success(`успешно получено ${ resources.length } ресурсов клиента "${ clientId }"`);
                return resources;
            }

            logger?.error(`не получилось получить ресурсы клиента "${ clientId }"`);
            throw new Error('ошибка запроса');
        });
};