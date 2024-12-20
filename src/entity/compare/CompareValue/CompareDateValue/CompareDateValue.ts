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
import { isArray } from '@vanyamate/types-kit';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export type CompareDateValueOnChangeHandler = (data: {
    dates: Array<Date>,
    formatted: Array<string>
}) => void;

export type CompareDateValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: Array<string>;
        onChange?: CompareDateValueOnChangeHandler;
        range?: boolean;
        multipleDates?: boolean;
        disabledRanges?: Array<[ string, string ]>;
        disable?: boolean;
    };

export class CompareDateValue extends Component<HTMLDivElement> implements ICompareValue<Array<string>> {
    private readonly _datepicker?: AirDatepicker<HTMLDivElement>;

    constructor (props: CompareDateValueProps) {
        const {
                  value, onChange, range, multipleDates, disable, ...other
              } = props;
        super('div', other);


        if (value) {
            this._datepicker = new AirDatepicker(this.element, {
                range            : range ?? false,
                dateTimeSeparator: ', ',
                multipleDates    : multipleDates ?? false,
                classes          : css.container,
                selectedDates    : getValidDates(value),
                dateFormat       : 'yyyy-MM-dd',
                onSelect         : ({ date, formattedDate }) => {
                    if (onChange) {
                        onChange({
                            dates    : isArray(date)
                                       ? date.sort((a, b) => +a - +b)
                                       : [ date ],
                            formatted: isArray(formattedDate)
                                       ? formattedDate.sort()
                                       : [ formattedDate ],
                        });
                        this.element.dispatchEvent(CompareEvent);
                    }
                },
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
        if (this._datepicker) {
            return this._datepicker.selectedDates.map((date) => this._datepicker!.formatDate(date, 'yyyy-MM-dd')).sort();
        }

        return [];
    }

    setDateByRange (range: Array<Date | string>) {
        this._datepicker?.clear({ silent: true });
        this._datepicker?.selectDate(range);
    }
}