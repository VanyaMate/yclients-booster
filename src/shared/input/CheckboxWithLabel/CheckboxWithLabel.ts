import { Checkbox, CheckboxProps } from '@/shared/input/Checkbox/Checkbox.ts';
import { Component } from '@/shared/component/Component.ts';
import css from './CheckboxWithLabel.module.css';


export type CheckboxWithLabelProps =
    CheckboxProps
    & {
        label: string;
    }

export class CheckboxWithLabel extends Component<HTMLInputElement> {
    private _checkbox: Checkbox;

    constructor (props: CheckboxWithLabelProps) {
        const { label, ...other } = props;
        const uniqueId            = Math.random().toString();

        super('div', {
            className: css.container,
            innerHTML: `<label for="${ uniqueId }">${ label }</label>`,
        });

        this._checkbox = new Checkbox({ ...other, id: uniqueId });
        this._checkbox.insert(this.element, 'afterbegin');
    }

    setChecked (status: boolean) {
        this._checkbox.setChecked(status);
    }
}