import {
    SalaryCriteriaUpdateData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';


export const salaryCriteriaUpdateDataToFormData = function (updateData: SalaryCriteriaUpdateData): FormData {
    const formData = new FormData();


    formData.set('title', updateData.title);
    formData.set('period_type', updateData.period);

    let unknownRuleIndex = 0;
    updateData.rules.forEach((rule) => {
        if (rule.id) {
            formData.set(`criteria_items[${ rule.id }][id]`, rule.id);
            formData.set(`criteria_items[${ rule.id }][context]`, JSON.stringify(rule.context));
            formData.set(`criteria_items[${ rule.id }][use_net_cost]`, rule.useNetCost);
            formData.set(`criteria_items[${ rule.id }][is_aggregate_individual]`, rule.individualType);
            formData.set(`criteria_items[${ rule.id }][targets_type]`, rule.targetType);
            formData.set(`criteria_items[${ rule.id }][amount]`, rule.amount);
            formData.set(`criteria_items[${ rule.id }][use_discount]`, rule.useDiscount);
        } else {
            formData.set(`criteria_items[new_${ unknownRuleIndex }][id]`, '');
            formData.set(`criteria_items[new_${ unknownRuleIndex }][context]`, JSON.stringify(rule.context));
            formData.set(`criteria_items[new_${ unknownRuleIndex }][use_net_cost]`, rule.useNetCost);
            formData.set(`criteria_items[new_${ unknownRuleIndex }][is_aggregate_individual]`, rule.individualType);
            formData.set(`criteria_items[new_${ unknownRuleIndex }][targets_type]`, rule.targetType);
            formData.set(`criteria_items[new_${ unknownRuleIndex }][amount]`, rule.amount);
            formData.set(`criteria_items[new_${ unknownRuleIndex }][use_discount]`, rule.useDiscount);
            unknownRuleIndex += 1;
        }
    });

    return formData;
};