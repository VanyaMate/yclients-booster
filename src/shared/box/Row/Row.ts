import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Row.module.css';


export type RowProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        cols: Array<Component<HTMLElement>>;
        inline?: boolean;
        alignItemsCenter?: boolean;
    }

export class Row extends Component<HTMLDivElement> {
    constructor (props: RowProps) {
        const { cols, inline, alignItemsCenter, ...other } = props;
        super('div', other, cols);
        this.element.classList.add(css.container);

        if (inline) {
            this.element.classList.add(css.inline);
        }

        if (alignItemsCenter) {
            this.element.classList.add(css.alignItemsCenter);
        }
    }
}