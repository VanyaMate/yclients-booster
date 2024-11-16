import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareItem,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';
import {
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    CompareHeader,
    CompareState,
} from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { Details } from '@/shared/box/Details/Details.ts';
import {
    salaryCriteriaRuleUseDiscountTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleUseDiscountTransform.ts';
import {
    salaryCriteriaRuleUseNetCostTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleUseNetCostTransform.ts';
import {
    salaryCriteriaRuleIndividualTypeTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleIndividualTypeTransform.ts';
import {
    salaryCriteriaRuleTargetTypeTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleTargetTypeTransform.ts';


export type CompareSalaryCriteriaRulesProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
    index: number,
    ruleFrom: SalaryCriteriaRuleData;
    ruleTo?: SalaryCriteriaRuleData;
};

export class CompareSalaryCriteriaRules extends Component<HTMLDivElement> implements ICompareItem<HTMLDivElement> {
    private readonly _ruleFrom: SalaryCriteriaRuleData;
    private readonly _index: number;
    private _details: Details | null                        = null;
    private _compareItems: Array<ICompareItem<HTMLElement>> = [];

    constructor (props: CompareSalaryCriteriaRulesProps) {
        const {
                  ruleFrom,
                  ruleTo,
                  index,
                  ...other
              } = props;
        super('div', other);
        this._index    = index;
        this._ruleFrom = ruleFrom;
        this.renderWithNewRule(ruleTo);
    }

    renderWithNewRule (rule?: SalaryCriteriaRuleData) {
        if (this._details) {
            this._details.remove();
        }

        const useDiscount    = new CompareRow({
            valueFrom: salaryCriteriaRuleUseDiscountTransform(this._ruleFrom.useDiscount)!,
            valueTo  : salaryCriteriaRuleUseDiscountTransform(rule?.useDiscount),
            label    : 'С учетом скидки',
        });
        const useNetCost     = new CompareRow({
            valueFrom: salaryCriteriaRuleUseNetCostTransform(this._ruleFrom.useNetCost)!,
            valueTo  : salaryCriteriaRuleUseNetCostTransform(rule?.useNetCost),
            label    : 'Тип',
        });
        const individualType = new CompareRow({
            valueFrom: salaryCriteriaRuleIndividualTypeTransform(this._ruleFrom.individualType)!,
            valueTo  : salaryCriteriaRuleIndividualTypeTransform(rule?.individualType)!,
            label    : 'Для кого',
        });
        const targetType     = new CompareRow({
            valueFrom: salaryCriteriaRuleTargetTypeTransform(this._ruleFrom.targetType)!,
            valueTo  : salaryCriteriaRuleTargetTypeTransform(rule?.targetType),
            label    : 'За что',
        });
        const amount         = new CompareRow({
            valueFrom: this._ruleFrom.amount,
            valueTo  : rule?.amount,
            label    : 'Превышает',
        });

        this._compareItems = [];
        this._compareItems.push(useNetCost);
        this._compareItems.push(individualType);
        this._compareItems.push(targetType);
        this._compareItems.push(amount);
        this._compareItems.push(useDiscount);

        const header = new CompareHeader({
            titleFrom : `Правило #${ this._index + 1 }`,
            titleTo   : rule ? `Правило #${ this._index + 1 }` : null,
            forceState: this.getValid() ? CompareState.VALID
                                        : CompareState.WARNING,
        });

        this._details = new Details({
            header : header,
            details: new Col({
                rows: [
                    useNetCost,
                    individualType,
                    targetType,
                    amount,
                    useDiscount,
                ],
            }),
        });

        this._details.insert(this.element, 'beforeend');
    }

    getValid (): boolean {
        return this._compareItems.every((row) => row.getValid());
    }
}