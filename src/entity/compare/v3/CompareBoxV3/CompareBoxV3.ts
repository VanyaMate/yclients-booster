import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { ICompareComponentV3 } from '@/entity/compare/v3/Compare.types.ts';
import css from './CompareBoxV3.module.css';


export type CompareBoxV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        title: string;
        level: number;
        components: Array<ICompareComponentV3>;
    };

export class CompareBoxV3 extends Component<HTMLDivElement> implements ICompareComponentV3 {
    private _enabled: boolean                              = true;
    private _compareComponents: Array<ICompareComponentV3> = [];

    constructor (props: CompareBoxV3Props) {
        const { title, components, level, ...other } = props;
        super('div', other, components);
        this._compareComponents = components;
        this.element.classList.add(css.container);

        new Component<HTMLHeadingElement>(`h${ level }`, {
            textContent: title,
            className  : css.title,
        })
            .insert(this.element, 'afterbegin');
    }

    get isValid () {
        if (this._enabled) {
            return this._compareComponents.every((component) => component.isValid);
        }

        return true;
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disabled);
        } else {
            this.element.classList.add(css.disabled);
        }
    }
}