import {
    SalaryCriteriaCreateData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';


export const salaryCriteriaCreateDataToFormData = function (createData: SalaryCriteriaCreateData): FormData {
    const formData = new FormData();

    formData.set('title', createData.title);
    formData.set('period_type', createData.period);

    createData.rules.forEach((rule, index) => {
        if (index === 0) {
            formData.set(`criteria_items[0][id]`, '0');
            formData.set(`criteria_items[0][context]`, JSON.stringify(rule.context));
            formData.set(`criteria_items[0][use_net_cost]`, rule.useNetCost);
            formData.set(`criteria_items[0][is_aggregate_individual]`, rule.individualType);
            formData.set(`criteria_items[0][targets_type]`, rule.targetType);
            formData.set(`criteria_items[0][amount]`, rule.amount);
            formData.set(`criteria_items[0][use_discount]`, rule.useDiscount);
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