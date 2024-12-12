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

export type TextInputHandler = (input: string) => void;

export type TextInputProps =
    Omit<ComponentPropsOptional<HTMLInputElement>, 'type'>
    & {
        type: TextInputType;
        onInput?: TextInputHandler;
    };

export class TextInput extends Component<HTMLInputElement> {
    constructor (props: TextInputProps) {
        const { onInput, ...other } = props;
        super('input', other);
        this.element.classList.add(css.container);

        if (onInput) {
            this.element.addEventListener('input', (event) => {
                onInput(((event.target) as HTMLInputElement).value);
            });
        }
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
        this.element.dispatchEvent(new CustomEvent('input', {
            detail: {
                target: this.element,
            },
        }));
    }

    setDisable (status: boolean) {
        this.element.disabled = status;
    }
}