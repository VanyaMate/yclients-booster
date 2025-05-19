import {
    FinancesSupplier,
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';


export const getFinancesSuppliersFromTableDomAction = function (dom: Document): Array<FinancesSupplier> {
    const table = dom.querySelector('table.table');

    if (table) {
        const rows      = [ ...table.querySelectorAll('tr.client-box') ];
        const suppliers = rows.map((row) => {
            const typeElement      = row.querySelector('td.project-people > i');
            const titleElement     = row.querySelector('td.project-title');
            const linkElement      = titleElement?.querySelector('a');
            const commentElement   = titleElement?.querySelector('small');
            const contactElement   = row.querySelector('td:nth-child(3)');
            const telephoneElement = contactElement?.querySelector('small');
            const emailElement     = telephoneElement?.querySelector(`small > i`);
            const innElement       = row.querySelector('td:nth-child(4)');
            const kppElement       = innElement?.querySelector('small');
            const addressElement   = row.querySelector('td:nth-child(5)');

            if (
                typeElement && titleElement && linkElement && commentElement && contactElement &&
                telephoneElement && emailElement && innElement && addressElement
            ) {
                const type: FinancesSupplierType = typeElement.classList.contains('fa-building-o')
                                                   ? FinancesSupplierType.YR :
                                                   typeElement.classList.contains('fa-truck')
                                                   ? FinancesSupplierType.IP
                                                   : FinancesSupplierType.FIZ;

                const id: string      = linkElement.href.split('supplier_id=')[1];
                const title: string   = linkElement.textContent!.trim();
                const comment: string = commentElement.textContent!.trim();
                const contact: string = contactElement.childNodes[0]?.nodeValue?.trim() ?? '';
                const phone: string   = telephoneElement.childNodes[0]?.nodeValue?.trim() ?? '';
                const email: string   = emailElement.textContent!.trim();
                const inn: string     = innElement.childNodes[0]?.nodeValue?.match(/\d+/)?.[0] ?? '';
                const kpp: string     = kppElement?.textContent!.match(/\d+/)?.[0] ?? '';
                const addr: string    = addressElement.textContent!.trim();

                return {
                    id,
                    type,
                    title,
                    comment,
                    contact,
                    phone,
                    email,
                    inn,
                    kpp,
                    addr,
                };
            } else {
                console.log('Чего то не хватает');
                console.dir({
                    typeElement, titleElement, linkElement, commentElement,
                    contactElement,
                    telephoneElement, emailElement, innElement, kppElement,
                    addressElement,
                });
                return null;
            }
        });

        return suppliers.filter((sup) => sup !== null);
    }

    return [];
};