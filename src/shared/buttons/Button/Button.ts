import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Button.module.css';


export enum ButtonStyleType {
    DEFAULT,
    PRIMARY,
    DANGER,
    WARNING
}

export enum ButtonSizeType {
    SMALL,
    MEDIUM,
    LARGE,
}


export type ButtonProps =
    ComponentPropsOptional<HTMLButtonElement>
    & {
        styleType?: ButtonStyleType;
        size?: ButtonSizeType;
        quad?: boolean;
        fullWidth?: boolean;
        noWrap?: boolean;
    };

export class Button extends Component<HTMLButtonElement> {
    constructor (props: ButtonProps) {
        const { styleType, size, quad, fullWidth, noWrap, ...other } = props;
        super('button', other);

        this.element.classList.add(css.container);

        if (styleType !== undefined) {
            this.setStyleType(styleType);
        }

        if (size === ButtonSizeType.SMALL) {
            this.element.classList.add(css.small);
        }

        if (quad) {
            this.element.classList.add(css.quad);
        }

        if (fullWidth) {
            this.element.classList.add(css.fullWidth);
        }

        if (noWrap) {
            this.element.classList.add(css.noWrap);
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

    setStyleType (styleType: ButtonStyleType) {
        this.element.classList.remove(css.primary);
        this.element.classList.remove(css.danger);
        this.element.classList.remove(css.warning);

        if (styleType === ButtonStyleType.PRIMARY) {
            this.element.classList.add(css.primary);
        } else if (styleType === ButtonStyleType.DANGER) {
            this.element.classList.add(css.danger);
        } else if (styleType === ButtonStyleType.WARNING) {
            this.element.classList.add(css.warning);
        }
    }

    setDisable (status: boolean) {
        this.element.disabled = status;
    }

    setText (text: string) {
        this.element.textContent = text;
    }
}