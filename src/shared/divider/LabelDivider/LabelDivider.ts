import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './LabelDivider.module.css';


export type LabelDividerProps =
    ComponentPropsOptional<HTMLDivElement>
    & {};

export class LabelDivider extends Component<HTMLDivElement> {
    constructor (props: LabelDividerProps) {
        const { ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
    }
}