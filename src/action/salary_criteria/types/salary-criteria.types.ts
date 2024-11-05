export type  SalaryCriteriaShortData = {
    id: string;
    title: string;
};

export type SalaryCriteriaContextCategory = {
    category: string;
    item: string;
}

export type SalaryCriteriaContextItem = {
    category: string;
    item: string;
}

export type SalaryCriteriaContext = {
    services?: {
        categories: Array<SalaryCriteriaContextCategory>,
        items: Array<SalaryCriteriaContextItem>,
    }
}

export type SalaryCriteriaRuleData = {
    id: string;
    useNetCost: number;
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