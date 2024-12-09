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


export type CompareTimeRangeValueType = [ number, number ];
export type CompareTimeRangeValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: CompareTimeRangeValueType;
        onChange?: (ranges: CompareTimeRangeValueType) => void;
    };

export class CompareTimeRangeValue extends Component<HTMLDivElement> implements ICompareValue<CompareTimeRangeValueType> {
    constructor (props: CompareTimeRangeValueProps) {
        const { value, onChange, ...other } = props;
        super('div', other, [
            new Range({
                min      : '0',
                max      : '23',
                step     : '1',
                label    : 'Часы',
                showValue: true,
            }),
            new Range({
                min      : '0',
                max      : '60',
                step     : '15',
                label    : 'Минуты',
                showValue: true,
            }),
        ]);
        this.element.classList.add(css.container);
    }

    getValue (): Nullable<CompareTimeRangeValueType> {
        return [ 0, 0 ];
    }
}