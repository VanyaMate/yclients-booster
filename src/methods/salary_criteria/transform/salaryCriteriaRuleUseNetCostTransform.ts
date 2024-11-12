export const salaryCriteriaRuleUseNetCostTransform = function (id: string | undefined): string | undefined {
    switch (id) {
        case '0':
            return 'Оборот';
        case '1':
            return 'Прибыль';
        case '2':
            return 'Количество';
        default:
            return undefined;
    }
};