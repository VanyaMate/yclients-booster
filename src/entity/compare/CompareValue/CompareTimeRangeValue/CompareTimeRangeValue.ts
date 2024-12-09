import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';
import css from './CompareTimeRangeValue.module.css';
import { Range } from '@/shared/input/Range/Range.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export type CompareTimeRangeValueType = [ number, number ];
export type CompareTimeRangeValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: CompareTimeRangeValueType;
        onChange?: (ranges: CompareTimeRangeValueType) => void;
    };

export class CompareTimeRangeValue extends Component<HTMLDivElement> implements ICompareValue<CompareTimeRangeValueType> {
    private readonly _currentValue: CompareTimeRangeValueType;

    constructor (props: CompareTimeRangeValueProps) {
        const { value, onChange, ...other } = props;
        let minutesRange: Range;
        super('div', other, [
            new Range({
                min      : '0',
                max      : '24',
                step     : '1',
                label    : 'Часы',
                showValue: true,
                value    : value[0].toString(),
                onChange : (value) => {
                    this._currentValue[0] = value;
                    if (value === 24) {
                        this._currentValue[1]            = 0;
                        minutesRange.input.element.value = '0';
                        minutesRange.input.element.dispatchEvent(new CustomEvent('input'));
                    }
                    this.element.dispatchEvent(CompareEvent);
                },
            }),
            minutesRange = new Range({
                min      : '0',
                max      : '55',
                step     : '5',
                label    : 'Минуты',
                showValue: true,
                value    : value[1].toString(),
                onChange : (value) => {
                    this._currentValue[1] = value;
                    this.element.dispatchEvent(CompareEvent);
                },
            }),
        ]);
        this._currentValue = value;
        this.element.classList.add(css.container);
    }

    getValue (): Nullable<CompareTimeRangeValueType> {
        return this._currentValue;
    }
}