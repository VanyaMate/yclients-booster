import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import {
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Nullable } from '@/types/Nullable';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import css from './SalaryCriteriaRuleCompareValue.module.css';


export type SalaryCriteriaRuleCompareValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: SalaryCriteriaRuleData;
        editable: boolean;
    };

export class SalaryCriteriaRuleCompareValue extends Component<HTMLDivElement> implements ICompareValue<SalaryCriteriaRuleData> {
    private readonly _value: SalaryCriteriaRuleData | null;

    constructor (props: SalaryCriteriaRuleCompareValueProps) {
        const {
                  value,
                  editable = true,
                  ...other
              } = props;
        super('div', other);
        this._value = value ?? null;
        this.element.classList.add(css.container);
        this._render(value, editable);
    }

    getValue (): Nullable<SalaryCriteriaRuleData> {
        return this._value;
    }

    private _render (value: SalaryCriteriaRuleData | undefined, editable: boolean) {
        // key: Input
        // key: Text

        new Col({
            rows: [
                this._row('id', value?.id, false),
                this._row('amount', value?.amount, editable),
                this._row('individualType', value?.individualType, editable),
                this._row('useDiscount', value?.useDiscount, editable),
                this._row('targetType', value?.targetType, editable),
                this._row('useNetCost', value?.useNetCost, editable),
            ],
        })
            .insert(this.element, 'afterbegin');
    }

    private _row (key: string, value: string | number | undefined, editable: boolean) {
        if (editable) {
            const uniqueId: string = `id-${ Math.random() }`;
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLLabelElement>('label', {
                        textContent: key,
                        htmlFor    : uniqueId,
                    }),
                    new CompareTextInputValue({
                        value: value?.toString(),
                        type : 'text',
                        id   : uniqueId,
                    }),
                ],
            });
        }

        return new Row({
            className: css.row,
            cols     : [
                new Component<HTMLSpanElement>('span', {
                    textContent: key,
                }),
                new CompareTextValue({
                    value: value?.toString(),
                }),
            ],
        });
    }
}