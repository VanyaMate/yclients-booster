import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Col.module.css';


export type ColProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        cols: Array<Component<HTMLElement>>;
    }

export class Col extends Component<HTMLDivElement> {
    constructor (props: ColProps) {
        const { cols, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);

        cols.forEach((child) => child.insert(this.element, 'beforeend'));
    }
}