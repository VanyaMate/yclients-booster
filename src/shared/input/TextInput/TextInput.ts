import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './TextInput.module.css';


export type TextInputType =
    'text'
    | 'number'
    | 'password'
    | 'email';

export type TextInputProps =
    Omit<ComponentPropsOptional<HTMLInputElement>, 'type'>
    & {
        type: TextInputType;
    };

export class TextInput extends Component<HTMLInputElement> {
    constructor (props: TextInputProps) {
        super('input', props);
        this.element.classList.add(css.container);
    }

    getValue (): string {
        return this.element.value;
    }

    setValue (value: string): void {
        this.element.value = value;
        this.element.dispatchEvent(new CustomEvent('change', {
            detail: {
                target: this.element,
            },
        }));
    }

    setDisable (status: boolean) {
        this.element.disabled = status;
    }
}