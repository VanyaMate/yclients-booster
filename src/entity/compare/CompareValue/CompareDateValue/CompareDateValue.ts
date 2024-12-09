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
import {
    getValidDates,
} from '@/entity/compare/CompareValue/CompareDateValue/lib/getValidDates.ts';


export type CompareDateValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: Array<string>;
        onChange?: (dates: Array<string>) => void;
        range?: boolean;
        multipleDates?: boolean;
        disabledRanges?: Array<[ string, string ]>;
        disable?: boolean;
    };

export class CompareDateValue extends Component<HTMLDivElement> implements ICompareValue<Array<string>> {
    constructor (props: CompareDateValueProps) {
        const {
                  value, onChange, range, multipleDates, disable, ...other
              } = props;
        super('div', other);


        if (value) {
            new AirDatepicker(this.element, {
                range            : range ?? false,
                dateTimeSeparator: ', ',
                multipleDates    : multipleDates ?? false,
                classes          : css.container,
                selectedDates    : getValidDates(value),
            });
            this.element.setAttribute('data-is-input', 'true');

            if (disable) {
                this.element.classList.add(css.disable);
            }
        } else {
            this.element.textContent = 'Пусто';
        }
    }

    getValue (): Nullable<Array<string>> {
        return [];
    }
}