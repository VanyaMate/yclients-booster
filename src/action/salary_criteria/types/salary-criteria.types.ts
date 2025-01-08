import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { GoodsCopyData } from '@/action/goods/types/good.types.ts';


export type  SalaryCriteriaShortData = {
    id: string;
    title: string;
};

export type SalaryCriteriaContextCategory = {
    categoryId: string;
}

export type SalaryCriteriaContextItem = {
    categoryId: string;
    itemId: string;
}

export type SalaryCriteriaContext = {
    services?: {
        categories: Array<SalaryCriteriaContextCategory>,
        items: Array<SalaryCriteriaContextItem>,
    },
    goods?: {
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

export type SalaryCriteriaList = Array<SalaryCriteriaFullData>;

export type SalaryCriteriaListDataForCopy = {
    criteriaList: SalaryCriteriaList;
    settingsCopyData: SettingsServiceCopyData;
    goodsCopyData: GoodsCopyData;
}