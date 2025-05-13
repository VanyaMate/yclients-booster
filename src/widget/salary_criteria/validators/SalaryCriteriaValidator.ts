import { Nullable } from '@/types/Nullable.ts';
import {
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { ICompareComponent } from '@/entity/compare/Compare.types.ts';


export namespace SalaryCriteriaValidator {
    export const rules = function (children: Array<ICompareComponent>, withContext: boolean = true) {
        return function (targetRule: Nullable<SalaryCriteriaRuleData>, clientRule: Nullable<SalaryCriteriaRuleData>): boolean {
            if (targetRule && clientRule) {
                if (targetRule.amount !== clientRule.amount) {
                    return false;
                }

                if (targetRule.targetType !== clientRule.targetType) {
                    return false;
                }

                if (targetRule.individualType !== clientRule.individualType) {
                    return false;
                }

                if (targetRule.useDiscount !== clientRule.useDiscount) {
                    return false;
                }

                if (targetRule.useNetCost !== clientRule.useNetCost) {
                    return false;
                }

                if (targetRule.context.services && withContext) {
                    if (clientRule.context.services) {
                        if (
                            targetRule
                                .context
                                .services
                                .categories
                                .some(
                                    (category, index) => category.category !== clientRule.context.services!.categories[index].category,
                                )
                        ) {
                            return false;
                        }

                        if (
                            targetRule
                                .context
                                .services
                                .items
                                .some(
                                    (service, index) =>
                                        service.category !== clientRule.context.services!.items[index].category ||
                                        service.item !== clientRule.context.services!.items[index].item,
                                )
                        ) {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                return children.every((child) => child.isValid);
            }

            return targetRule === clientRule;
        };
    };
}