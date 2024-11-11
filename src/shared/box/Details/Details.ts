import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Details.module.css';


export type DetailsProps =
    ComponentPropsOptional<HTMLDetailsElement>
    & {
        header: Component<HTMLElement>,
        details: Component<HTMLElement>,
    };

export class Details extends Component<HTMLDetailsElement> {
    constructor (props: DetailsProps) {
        const { header, details, ...other } = props;
        super('details', other, [
            new Component<HTMLDetailsElement>('summary', {}, [ header ]),
            details,
        ]);
        this.element.classList.add(css.container);
    }
}