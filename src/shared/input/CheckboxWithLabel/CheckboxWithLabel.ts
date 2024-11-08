import { Checkbox, CheckboxProps } from '@/shared/input/Checkbox/Checkbox.ts';
import { Component } from '@/shared/component/Component.ts';
import css from './CheckboxWithLabel.module.css';


export type CheckboxWithLabelProps =
    CheckboxProps
    & {
        label: string;
        labelPrefix?: string;
    }

export class CheckboxWithLabel extends Component<HTMLInputElement> {
    private _checkbox: Checkbox;
    private readonly _label: string;

    constructor (props: CheckboxWithLabelProps) {
        const { label, labelPrefix, ...other } = props;
        const uniqueId                         = Math.random().toString();

        super('div', { className: css.container });

        const children = [
            new Component<HTMLSpanElement>('span', { textContent: label }),
        ];

        if (labelPrefix !== undefined) {
            children.unshift(
                new Component<HTMLSpanElement>('span', {
                    textContent: labelPrefix,
                    className  : css.prefix,
                }),
            );
        }

        new Component<HTMLLabelElement>('label', { htmlFor: uniqueId }, children)
            .insert(this.element, 'afterbegin');

        this._label    = label;
        this._checkbox = new Checkbox({ ...other, id: uniqueId });
        this._checkbox.insert(this.element, 'afterbegin');
    }

    setChecked (status: boolean, force: boolean = false) {
        this._checkbox.setChecked(status, force);
    }

    setDisable (state: boolean) {
        this._checkbox.setDisable(state);
    }

    getLabel (): string {
        return this._label;
    }

    getValue () {
        return this._checkbox.getValue();
    }

    getState () {
        return this._checkbox.getState();
    }
}