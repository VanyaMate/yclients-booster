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
        fullHide?: boolean;
    };

export class Details extends Component<HTMLDetailsElement> {
    constructor (props: DetailsProps) {
        const { header, details, type, fullHide = false, ...other } = props;
        super('details', other, [
            new Component<HTMLDetailsElement>('summary', {}, [ header ]),
        ]);

        this.element.classList.add(css.container);

        if (type === DetailsType.SECOND) {
            this.element.classList.add(css.second);
        } else if (type === DetailsType.MAIN) {
            this.element.classList.add(css.main);
        }

        if (fullHide) {
            this.element.addEventListener('toggle', this._toggleHandler.bind(this, details, false));
            this._toggleHandler(details, true);
        } else {
            details.insert(this.element, 'beforeend');
        }
    }

    private _toggleHandler (details: IComponent<HTMLElement>, passive: boolean = false): void {
        if (this.element.open) {
            if (passive) {
                if (details.element.parentElement !== this.element) {
                    details.insert(this.element, 'beforeend');
                }
            } else {
                details.insert(this.element, 'beforeend');
            }
        } else {
            details.remove();
        }
    }
}