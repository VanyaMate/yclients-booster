export const salaryCriteriaRuleTargetTypeTransform = function (id: string | undefined): string | undefined {
    switch (id) {
        case '0':
            return 'Оказание услуг';
        case '1':
            return 'Продажа товаров';
        case '2':
            return 'Оказание услуг и продажа товаров';
        default:
            return undefined;
    }
};