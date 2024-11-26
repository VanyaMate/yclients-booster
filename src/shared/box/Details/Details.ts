import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Details.module.css';
import { IComponent } from '@/shared/component/Component.interface.ts';


export enum DetailsType {
    MAIN,
    SECOND,
}

export type DetailsProps =
    ComponentPropsOptional<HTMLDetailsElement>
    & {
        header: IComponent<HTMLElement>,
        details: IComponent<HTMLElement>,
        type?: DetailsType,
    };

export class Details extends Component<HTMLDetailsElement> {
    constructor (props: DetailsProps) {
        const { header, details, type, ...other } = props;
        super('details', other, [
            new Component<HTMLDetailsElement>('summary', {}, [ header ]),
            details,
        ]);
        this.element.classList.add(css.container);
        if (type === DetailsType.SECOND) {
            this.element.classList.add(css.second);
        }
    }
}