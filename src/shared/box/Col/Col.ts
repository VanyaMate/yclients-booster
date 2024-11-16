import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Col.module.css';
import { IComponent } from '@/shared/component/Component.interface.ts';


export type ColProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        rows: Array<IComponent<HTMLElement>>;
    }

export class Col extends Component<HTMLDivElement> {
    constructor (props: ColProps) {
        const { rows, ...other } = props;
        super('div', other, rows);
        this.element.classList.add(css.container);
    }

    add (row: Component<HTMLElement>) {
        row.insert(this.element, 'beforeend');
    }
}