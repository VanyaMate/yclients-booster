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
        ]);

        this.element.classList.add(css.container);
        if (type === DetailsType.SECOND) {
            this.element.classList.add(css.second);
        } else if (type === DetailsType.MAIN) {
            this.element.classList.add(css.main);
        }

        this.element.addEventListener('toggle', this._onClickHandler.bind(this, details));
    }

    private _onClickHandler (details: IComponent<HTMLElement>): void {
        if (this.element.open) {
            details.insert(this.element, 'beforeend');
        } else {
            details.remove();
        }
    }
}