import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { IComponent } from '@/shared/component/Component.interface.ts';
import css from './Range.module.css';


export type RangeOnChange = (value: number) => void;
export type RangeProps =
    ComponentPropsOptional<HTMLInputElement>
    & {
        label?: string;
        showValue?: boolean;
        onChange?: RangeOnChange;
    };

export class Range extends Component<HTMLDivElement> {
    private _header?: IComponent<HTMLDivElement>;
    private _showValue?: IComponent<HTMLDivElement>;
    private _input: IComponent<HTMLInputElement>;

    constructor (props: RangeProps) {
        const { label, showValue, onChange, ...other } = props;
        super('div', {
            className: css.container,
        });

        this._input = new Component<HTMLInputElement>('input', {
            ...other,
            type : 'range',
            value: other.value ?? other.min ?? '0',
        });
        this._input.element.classList.add(css.input);
        this._input.insert(this.element, 'afterbegin');

        if (label !== undefined || showValue) {
            this._header = new Component<HTMLDivElement>('div', {
                className: css.header,
            });
            this._header.insert(this.element, 'afterbegin');
        }

        if (label !== undefined) {
            new Component<HTMLDivElement>('div', {
                textContent: label,
                className  : css.label,
            }).insert(this._header!.element, 'afterbegin');
        }

        if (showValue) {
            this._showValue = new Component<HTMLDivElement>('div', {
                textContent: other.value ?? other.min ?? '0',
                className  : css.value,
            });
            this._showValue.insert(this._header!.element, 'beforeend');
            this._input.element.addEventListener('input', () => {
                this._showValue!.element.textContent = this._input.element.value;
            });
        }
    }

    getValue (): number {
        return Number(this._input.element.value);
    }
}