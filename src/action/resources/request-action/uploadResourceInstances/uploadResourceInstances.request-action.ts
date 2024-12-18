import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { ResourceInstance } from '@/action/resources/types/resources.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const uploadResourceInstancesRequestAction = async function (resourceId: string, logger?: ILogger): Promise<Array<ResourceInstance>> {
    logger?.log(`попытка получить экземпляры ресурса "${ resourceId }"`);
    return fetch(`https://yclients.com/resource_instances/${ resourceId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom) => {
            const table = dom.querySelector(`.page-table > .project-list > table > tbody`);

            if (table) {
                const instancesRows                      = [ ...table.querySelectorAll('.client-box') ];
                const instances: Array<ResourceInstance> = [];

                let instanceRow;
                let link;
                let id;
                let title;
                for (let i = 0; i < instancesRows.length; i++) {
                    instanceRow = instancesRows[i];
                    link        = instanceRow.querySelector<HTMLAnchorElement>(`.project-title a`);

                    if (link) {
                        id    = link.href.split('/').slice(-1)[0];
                        title = link.textContent!.trim();

                        instances.push({ id, title });
                    }
                }

                logger?.success(`успешно получено ${ instances.length } экземпляров ресурса "${ resourceId }"`);
                return instances;
            }

            const noExistNotification = dom.querySelector(`.page-table > .text-center > .font-bold`);

            if (noExistNotification) {
                logger?.warning(`у ресурса "${ resourceId }" нет экземпляров или что-то пошло не так`);
                return [];
            }

            throw new Error('не найдена ни таблица ни предупреждение');
        })
        .catch((e: Error) => {
            logger?.error(`не получилось получить экземпляры ресурса "${ resourceId }". ${ e.message }`);
            throw e;
        });
};