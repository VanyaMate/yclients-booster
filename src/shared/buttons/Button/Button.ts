import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Button.module.css';


export enum ButtonStyleType {
    PRIMARY,
    DANGER,
}

export type ButtonProps =
    ComponentPropsOptional<HTMLButtonElement>
    & {
        styleType?: ButtonStyleType;
        quad?: boolean;
        fullWidth?: boolean;
    };

export class Button extends Component<HTMLButtonElement> {
    constructor (props: ButtonProps) {
        const { styleType, quad, fullWidth, ...other } = props;
        super('button', other);

        this.element.classList.add(css.container);
        if (styleType === ButtonStyleType.PRIMARY) {
            this.element.classList.add(css.primary);
        } else if (styleType === ButtonStyleType.DANGER) {
            this.element.classList.add(css.danger);
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