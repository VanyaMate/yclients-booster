import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareTextValue.module.css';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';


export type CompareTextValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: string;
        label?: string;
    };

export class CompareTextValue extends Component<HTMLDivElement> implements ICompareValue<string> {
    private readonly _value?: string;
    private readonly _label?: string;

    constructor (props: CompareTextValueProps) {
        const { label, value, ...other } = props;
        super('div', other);

        this._value = value;
        this._label = label;

        this.element.classList.add(css.container);

        if (this._value === undefined) {
            this.element.textContent = '-';
            this.element.classList.add(css.isNotValue);
        } else if (this._value.trim() === '') {
            this.element.textContent = 'Пусто';
            this.element.classList.add(css.empty);
            this.element.classList.add(css.isNotValue);
        } else if (this._label) {
            this.element.textContent = this._label;
            this.element.classList.add(css.isNotValue);
        } else {
            this.element.textContent = this._value.toString();
        }
    }

    getValue (): any {
        return this._value ?? null;
    }
}