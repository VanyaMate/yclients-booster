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


export type CompareSalaryCriteriaRulesProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        index: number,
        ruleFrom: SalaryCriteriaRuleData;
        ruleTo?: SalaryCriteriaRuleData;
    };

export class CompareSalaryCriteriaRules extends Component<HTMLDivElement> implements ICompareItem {
    private readonly _ruleFrom: SalaryCriteriaRuleData;
    private readonly _index: number;
    private _col: Details | null       = null;
    private _rows: Array<ICompareItem> = [];

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
        if (this._col) {
            this._col.remove();
        }

        const useDiscount    = new CompareRow({
            valueFrom: this._ruleFrom.useDiscount,
            valueTo  : rule?.useDiscount,
            label    : 'useDiscount',
        });
        const useNetCost     = new CompareRow({
            valueFrom: this._ruleFrom.useNetCost,
            valueTo  : rule?.useNetCost,
            label    : 'useNetCost',
        });
        const individualType = new CompareRow({
            valueFrom: this._ruleFrom.individualType,
            valueTo  : rule?.individualType,
            label    : 'individualType',
        });
        const targetType     = new CompareRow({
            valueFrom: this._ruleFrom.targetType,
            valueTo  : rule?.targetType,
            label    : 'targetType',
        });
        const amount         = new CompareRow({
            valueFrom: this._ruleFrom.amount,
            valueTo  : rule?.amount,
            label    : 'amount',
        });

        this._rows = [];
        this._rows.push(useDiscount);
        this._rows.push(useNetCost);
        this._rows.push(individualType);
        this._rows.push(targetType);
        this._rows.push(amount);

        const header = new CompareHeader({
            titleFrom : `Правило #${ this._index + 1 }`,
            titleTo   : rule ? `Правило #${ this._index + 1 }` : null,
            forceState: this.getValid() ? CompareState.VALID
                                        : CompareState.WARNING,
        });

        this._col = new Details({
            header : header,
            details: new Col({
                rows: [
                    useDiscount,
                    useNetCost,
                    individualType,
                    targetType,
                    amount,
                ],
            }),
        });

        this._col.insert(this.element, 'beforeend');
    }

    getValid (): boolean {
        return this._rows.every((row) => row.getValid());
    }
}