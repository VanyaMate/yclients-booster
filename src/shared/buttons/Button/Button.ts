import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Button.module.css';


export type ButtonProps =
    ComponentPropsOptional<HTMLButtonElement>
    & {
        isPrimary?: boolean;
        quad?: boolean;
        fullWidth?: boolean;
    };

export class Button extends Component<HTMLButtonElement> {
    constructor (props: ButtonProps) {
        const { isPrimary, quad, fullWidth, ...other } = props;
        super('button', other);

        this.element.classList.add(css.container);
        if (isPrimary) {
            this.element.classList.add(css.primary);
        }

        if (quad) {
            this.element.classList.add(css.quad);
        }

        if (fullWidth) {
            this.element.classList.add(css.fullWidth);
        }
    }

    setLoading (status: boolean) {
        if (status) {
            this.element.classList.add(css.loading);
            this.element.disabled = true;
        } else {
            this.element.classList.remove(css.loading);
            this.element.disabled = false;
        }
    }
}