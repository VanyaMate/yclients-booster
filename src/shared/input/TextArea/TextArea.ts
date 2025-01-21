import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './TextArea.module.css';


export type TextAreaInputHandler = (input: string) => void;

export type TextAreaProps =
    ComponentPropsOptional<HTMLTextAreaElement>
    & {
        onInput?: TextAreaInputHandler;
        preferHeight?: number;
    };

export class TextArea extends Component<HTMLTextAreaElement> {
    constructor (props: TextAreaProps) {
        const { onInput, preferHeight, ...other } = props;
        super('textarea', other);
        this.element.classList.add(css.container);

        if (onInput) {
            this.element.addEventListener('input', (event) => {
                onInput(((event.target) as HTMLTextAreaElement).value);
            });
        }

        if (preferHeight) {
            this.element.style.height = `${ preferHeight }px`;
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
    }

    setDisable (status: boolean) {
        this.element.disabled = status;
    }
}