export enum FinancesExpenseType {
    PROFIT         = 7,
    EXPENSES_SEBES = 1,
    EXPENSES_COMM  = 2,
    EXPENSES_STUFF = 3,
    EXPENSES_ADMIN = 4,
    TAX            = 5,
    EXPENSES_OTHER = 6,
}

export type FinancesExpenseCreateData = Omit<FinancesExpense, 'id'>;
export type FinancesExpenseUpdateData = Omit<FinancesExpense, 'id'>;

export type FinancesExpense = {
    id: string;
    type: FinancesExpenseType,
    title: string;
    comment: string;
}