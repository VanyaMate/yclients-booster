import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './TextArea.module.css';


export type TextAreaProps = ComponentPropsOptional<HTMLTextAreaElement>;

export class TextArea extends Component<HTMLTextAreaElement> {
    constructor (props: TextAreaProps) {
        super('textarea', props);
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