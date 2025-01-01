import { GoodIds } from '@/action/goods/list/types/goods-category.types.ts';


export const getSelectedGoodsIdsDomAction = function (document: Document): Array<GoodIds> {
    const rows = [ ...document.querySelectorAll(`#page-wrapper .wrapper-content table tbody tr.client-box`) ];

    return rows
        .filter((row: Element) => {
            const checkbox = row.querySelector<HTMLInputElement>('input.checkbox');
            const link     = row.querySelector<HTMLAnchorElement>('a');
            if (checkbox && link) {
                return checkbox.checked;
            }

            return false;
        })
        .map((row: Element) => {
            const link               = row.querySelector<HTMLAnchorElement>('a')!.href;
            const [ categoryId, id ] = link.split('/').slice(6, 8);

            return {
                id, categoryId,
            };
        });
};