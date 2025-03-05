import {
    SalaryCriteriaUpdateData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';


export const salaryCriteriaUpdateDataToFormData = function (updateData: SalaryCriteriaUpdateData): FormData {
    const formData = new FormData();


    formData.set('title', updateData.title);
    formData.set('period_type', updateData.period);

    updateData.rules.forEach((rule, index) => {
        if (rule.id) {
            formData.set(`criteria_items[${ rule.id }][id]`, rule.id);
            formData.set(`criteria_items[${ rule.id }][context]`, JSON.stringify(rule.context));
            formData.set(`criteria_items[${ rule.id }][use_net_cost]`, rule.useNetCost);
            formData.set(`criteria_items[${ rule.id }][is_aggregate_individual]`, rule.individualType);
            formData.set(`criteria_items[${ rule.id }][targets_type]`, rule.targetType);
            formData.set(`criteria_items[${ rule.id }][amount]`, rule.amount);
            formData.set(`criteria_items[${ rule.id }][use_discount]`, rule.useDiscount);
        } else {
            formData.set(`criteria_items[new_${ index }][id]`, '');
            formData.set(`criteria_items[new_${ index }][context]`, JSON.stringify(rule.context));
            formData.set(`criteria_items[new_${ index }][use_net_cost]`, rule.useNetCost);
            formData.set(`criteria_items[new_${ index }][is_aggregate_individual]`, rule.individualType);
            formData.set(`criteria_items[new_${ index }][targets_type]`, rule.targetType);
            formData.set(`criteria_items[new_${ index }][amount]`, rule.amount);
            formData.set(`criteria_items[new_${ index }][use_discount]`, rule.useDiscount);
        }
    });

    return formData;
};