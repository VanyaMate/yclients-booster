export const salaryCriteriaRuleUseDiscountTransform = function (id: string | undefined): string | undefined {
    switch (id) {
        case '0':
            return 'Нет';
        case '1':
            return 'Да';
        default:
            return undefined;
    }
};