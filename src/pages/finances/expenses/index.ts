import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    AddMassFinancesExpensesModal,
} from '@/widget/finances/expenses/AddMassFinancesExpensesModal/AddMassFinancesExpensesModal.ts';
import {
    CopyFinancesExpenseModal,
} from '@/widget/finances/expenses/CopyFinancesExpenseModal/CopyFinancesExpenseModal.ts';


export const isFinancesExpenses = function (pathname: Array<string>): boolean {
    return pathname[1] === 'finances' && pathname[2] === 'expenses' && pathname[3] === 'list' && !!pathname[4].match(/\d+/);
};

export const financesExpensesPageHandler = function (pathname: Array<string>) {
    startHandler(() => {
        const clientId  = pathname[4];
        const container = document.querySelector('.wrapper-content');

        if (container) {
            new Col({
                rows: [
                    new AddMassFinancesExpensesModal({ clientId }),
                    new CopyFinancesExpenseModal({ clientId }),
                ],
            }).insert(container, 'afterbegin');
        }
    });
};