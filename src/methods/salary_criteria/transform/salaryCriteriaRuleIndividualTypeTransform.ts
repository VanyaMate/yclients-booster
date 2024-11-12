export const salaryCriteriaRuleIndividualTypeTransform = function (id: string | undefined): string | undefined {
    switch (id) {
        case '0':
            return 'Филиала';
        case '1':
            return 'Сотрудника';
        default:
            return undefined;
    }
};