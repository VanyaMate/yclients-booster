import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Resource } from '@/action/resources/types/resources.types.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const uploadResourceByTitleRequestAction = async function (clientId: string, title: string, logger?: ILogger): Promise<Resource> {
    logger?.log(`получение ресурса "${ title }" для клиента "${ clientId }"`);

    return fetch(`https://yclients.com/resources/${ clientId }`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then(async (dom) => {
            const table = dom.querySelector(`.page-table > .project-list > table > tbody`);
            if (table) {
                const resourcesRows = [ ...table.querySelectorAll('.client-box') ];

                let resourceRow;
                let link;
                let descriptionElement;
                let _title;
                let id;

                for (let i = resourcesRows.length; i >= 0; i--) {
                    resourceRow        = resourcesRows[i];
                    link               = resourceRow.children[1]?.querySelector('a');
                    descriptionElement = resourceRow.children[2];
                    if (link && descriptionElement) {
                        id     = link.href.split('/').slice(-1)[0];
                        _title = link.textContent!.trim();

                        if (_title === title) {
                            logger?.success(`ресурс "${ title }" клиента "${ clientId }" получен`);

                            return {
                                id         : id,
                                title      : _title,
                                description: descriptionElement.textContent!.trim(),
                                instances  : [],
                            };
                        }
                    }
                }

                logger?.error(`ресурс "${ title }" клиента "${ clientId }" не найден`);
                throw new Error(`ресурс "${ title }" клиента "${ clientId }" не найден`);
            }

            logger?.error(`не получилось получить ресурсы клиента "${ clientId }"`);
            throw new Error(`не получилось получить ресурсы клиента "${ clientId }"`);
        });
};