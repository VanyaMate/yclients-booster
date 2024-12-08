import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareTextValue.module.css';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';


export type CompareTextValueProps<ValueType> =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: ValueType;
        label?: string;
    };

export class CompareTextValue<ValueType> extends Component<HTMLDivElement> implements ICompareValue<ValueType> {
    private readonly _value?: ValueType;
    private readonly _label?: string;

    constructor (props: CompareTextValueProps<ValueType>) {
        const { label, value, ...other } = props;
        super('div', other);

        this._value = value;
        this._label = label;

        this.element.classList.add(css.container);

        if (this._value === undefined) {
            this.element.textContent = '-';
            this.element.classList.add(css.isNotValue);
        } else if (typeof this._value === 'string' && this._value.trim() === '') {
            this.element.textContent = 'Пусто';
            this.element.classList.add(css.empty);
            this.element.classList.add(css.isNotValue);
        } else if (this._label) {
            this.element.textContent = this._label;
            this.element.classList.add(css.isNotValue);
        } else {
            this.element.textContent = this._value?.toString() ?? '-';
        }
    }

    getValue (): Nullable<ValueType> {
        return this._value ?? null;
    }
}