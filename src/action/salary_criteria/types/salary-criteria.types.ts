export type  SalaryCriteriaShortData = {
    id: string;
    title: string;
};

export type SalaryCriteriaContextCategory = {
    categoryId: string;
    title: string;
    children: Array<SalaryCriteriaContextItem>;
}

export type SalaryCriteriaContextItem = {
    categoryId: string;
    categoryTitle: string;
    itemId: string;
    title: string;
}

export type SalaryCriteriaContext = {
    services?: {
        categories: Array<SalaryCriteriaContextCategory>,
        items: Array<SalaryCriteriaContextItem>,
    }
}

export type SalaryCriteriaRuleData = {
    id: string;
    useNetCost: string;
    individualType: string;
    targetType: string;
    amount: string;
    useDiscount: string;
    context: SalaryCriteriaContext;
}

export type SalaryCriteriaFullData = {
    id: string;
    title: string;
    period: string;
    rules: Array<SalaryCriteriaRuleData>;
}