export type StuffItem = {
    id: string;
    name: string;
}

export const getStuffListDomAction = function (dom: Document): Array<StuffItem> {
    const container = dom.querySelector('.nav-menu-category > .nav-second-level');
    if (!container) {
        return [];
    }

    return [ ...container.querySelectorAll<HTMLAnchorElement>(`li.li_master > a`) ]
        .map((item) =>
            item.href
            ? ({
                id  : item.href.split('/').slice(-1)[0],
                name: item.title,
            })
            : null,
        ).filter((item) => item !== null);
};