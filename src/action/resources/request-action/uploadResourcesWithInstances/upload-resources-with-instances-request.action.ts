import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Resource } from '@/action/resources/types/resources.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import {
    uploadResourceInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourceInstances/uploadResourceInstances.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    getResourceServiceIdsRequestAction,
} from '@/action/resources/request-action/getResourceServiceIds/getResourceServiceIds.request-action.ts';


export const uploadResourcesWithInstancesRequestAction = async function (
    clientId: string,
    limit: number = PROMISE_SPLITTER_MAX_REQUESTS,
    retry: number = PROMISE_SPLITTER_MAX_RETRY,
    logger?: ILogger,
): Promise<Array<Resource>> {
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
                for (let i = 0; i < resourcesRows.length; i++) {
                    resourceRow        = resourcesRows[i];
                    link               = resourceRow.children[1]?.querySelector('a');
                    descriptionElement = resourceRow.children[2];

                    if (link && descriptionElement) {
                        id = link.href.split('/').slice(-1)[0];
                        resources.push({
                            id         : id,
                            title      : link.textContent!.trim(),
                            description: descriptionElement.textContent!.trim(),
                            instances  : [],
                            serviceIds : [],
                        });
                    }
                }

                const promiseSplitter = new PromiseSplitter(limit, retry);
                await promiseSplitter.exec(
                    resources.map((resource) => ({
                        chain    : [
                            () => uploadResourceInstancesRequestAction(resource.id, logger),
                        ],
                        onSuccess: (instances: unknown) => {
                            if (Array.isArray(instances)) {
                                resource.instances = instances;
                            }
                        },
                    })),
                );
                await promiseSplitter.exec(
                    resources.map((resource) => ({
                        chain    : [
                            () => getResourceServiceIdsRequestAction(clientId, resource.id, logger),
                        ],
                        onSuccess: (ids: unknown) => {
                            if (Array.isArray(ids)) {
                                resource.serviceIds = ids;
                            }
                        },
                    })),
                );

                logger?.success(`успешно получено ${ resources.length } ресурсов клиента "${ clientId }"`);
                return resources;
            }

            const emptyMessage = dom.querySelector(`.page-table > .text-center > h3`);

            if (emptyMessage) {
                logger?.warning(`у клиента "${ clientId }" нет ресурсов или что-то пошло не так. причина: ${ emptyMessage.textContent!.trim() }`);
                return [];
            }

            logger?.error(`не получилось получить ресурсы клиента "${ clientId }"`);
            throw new Error('ошибка запроса');
        });
};