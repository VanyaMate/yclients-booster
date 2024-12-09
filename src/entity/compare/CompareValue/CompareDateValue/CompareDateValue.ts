import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';
import AirDatepicker from 'air-datepicker';
import 'air-datepicker/air-datepicker.css';
import css from './CompareDateValue.module.css';


export type CompareDateValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: Array<string>;
        onChange?: (dates: Array<string>) => void;
    };

export class CompareDateValue extends Component<HTMLDivElement> implements ICompareValue<Array<string>> {
    constructor (props: CompareDateValueProps) {
        const { value, onChange, ...other } = props;
        super('div', other);
        new AirDatepicker(this.element, {
            range            : true,
            dateTimeSeparator: ', ',
            multipleDates    : true,
            classes          : css.container,
        });
        this.element.setAttribute('data-is-input', 'true');
    }

    getValue (): Nullable<Array<string>> {
        return [];
    }
}