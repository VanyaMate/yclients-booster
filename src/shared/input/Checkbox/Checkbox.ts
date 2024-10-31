import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Checkbox.module.css';


export type CheckboxProps =
    Omit<ComponentPropsOptional<HTMLInputElement>, 'type'>;

export class Checkbox extends Component<HTMLInputElement> {
    constructor (props: CheckboxProps) {
        super('input', { ...props, type: 'checkbox' });
        this.element.classList.add(css.container);
    }

    setChecked (status: boolean) {
        this.element.checked = status;
        this.element.dispatchEvent(new CustomEvent('change', {
            detail: {
                target: this.element,
            },
        }));
    }
}