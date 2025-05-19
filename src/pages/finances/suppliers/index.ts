import { startHandler } from '@/shared/lib/startHandler.ts';
import {
    CopyFinancesSuppliersModal,
} from '@/widget/finances/suppliers/CopyFinancesSuppliersModal/CopyFinancesSuppliersModal.ts';


export const isFinancesSuppliersPage = function (pathname: Array<string>): boolean {
    return pathname[1] === 'finances' && pathname[2] === 'suppliers' && pathname[3] === 'list' && !!pathname[4].match(/\d+/);
};

export const financesSuppliersPageHandler = function (pathname: Array<string>) {
    startHandler(() => {
        const container        = document.querySelector('.page-heading-content');
        const clientId: string = pathname[4];

        if (container) {
            new CopyFinancesSuppliersModal({ clientId }).insert(container, 'beforeend');
        }
    });
};