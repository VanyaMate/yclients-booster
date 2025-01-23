import {
    GroupLoyaltyCertificateShortData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';


export const getGroupLoyaltyCertificatesFromDom = function (dom: Document): Array<GroupLoyaltyCertificateShortData> {
    const container = dom.querySelector<HTMLDivElement>(`#page-wrapper > .wrapper-content > .ibox table tbody`);

    if (container) {
        const rows = [ ...container.querySelectorAll<HTMLTableRowElement>('tr') ];
        return rows.map((row) => {
            const link = row.querySelector<HTMLAnchorElement>('a');
            return {
                id   : link!.href.split('/').slice(-1)[0],
                title: link!.textContent!.trim(),
            };
        });
    }

    throw new Error(`не удалось найти таблицу в документе. возможно, что у клиента нет сертификатов`);
};