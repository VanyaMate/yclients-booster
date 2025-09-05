import { ILogger } from '@/action/_logger/Logger.interface.ts';


export type TechnologicalCartShortData = {
    id: string;
    title: string;
}

export const getTechnologicalCardsDomAction = function (dom: Document, logger?: ILogger): Array<TechnologicalCartShortData> {
    logger?.log('попытка получить технологические карточки товара');
    const table = dom.querySelector('table.table');
    if (!table) {
        logger?.warning(`технологические карты не получены. на странице отсутствует таблица`);
        return [];
    }

    const rows      = table.querySelectorAll('.client-box');
    const techCards = [ ...rows ]
        .map((row) => {
            const link  = row.querySelector<HTMLAnchorElement>('.project-actions > a');
            const title = row.querySelector<HTMLLIElement>(`.project-title > a`);
            if (title && link) {
                return {
                    id   : link.href.split('/').slice(-1)[0],
                    title: title.textContent?.trim() ?? '[Неизвестный]',
                };
            }

            return {
                id   : '',
                title: '',
            };
        })
        .filter((item) => item.id.length > 0);

    if (techCards.length > 0) {
        logger?.success(`получено ${ techCards.length } технологических карт`);
    } else {
        logger?.warning(`не найдено ни одной технологической карты`);
    }
    return techCards;
};