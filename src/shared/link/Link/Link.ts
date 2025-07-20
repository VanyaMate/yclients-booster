import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Link.module.css';


export type LinkProps =
    ComponentPropsOptional<HTMLAnchorElement>;

export class Link extends Component<HTMLAnchorElement> {
    constructor (props: LinkProps) {
        super('a', props);
        this.element.classList.add(css.container);
    }
}