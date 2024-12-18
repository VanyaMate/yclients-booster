import { ICompareComponent } from '../Compare.types.ts';
import css from './CompareBox.module.css';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';


export type CompareBoxProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        title: string;
        level: number;
        components: Array<ICompareComponent>;
    };

export class CompareBox extends Component<HTMLDivElement> implements ICompareComponent {
    private _enabled: boolean                            = true;
    private _compareComponents: Array<ICompareComponent> = [];

    constructor (props: CompareBoxProps) {
        const { title, components, level, ...other } = props;
        super('div', other, components);
        this._compareComponents = components;
        this.element.classList.add(css.container);

        new Component<HTMLHeadingElement>(`h${ level }`, {
            textContent: title,
            className  : css.title,
        })
            .insert(this.element, 'afterbegin');

        if (this._compareComponents.length === 0) {
            new Component<HTMLDivElement>('div', {
                textContent: 'Ничего нет',
                className  : css.empty,
            })
                .insert(this.element, 'beforeend');
        }
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