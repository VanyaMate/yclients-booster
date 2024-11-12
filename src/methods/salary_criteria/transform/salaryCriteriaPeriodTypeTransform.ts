export const salaryCriteriaPeriodTypeTransform = function (id: unknown): string | undefined {
    switch (id) {
        case '0':
            return 'Месяц';
        case '1':
            return 'День';
        default:
            return undefined;
    }
};