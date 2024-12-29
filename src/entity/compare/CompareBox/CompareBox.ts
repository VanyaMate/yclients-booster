import { ICompareComponent } from '../Compare.types.ts';
import css from './CompareBox.module.css';
import {
    Component,
} from '@/shared/component/Component.ts';
import { Details, DetailsProps } from '@/shared/box/Details/Details.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type CompareBoxProps =
    Omit<DetailsProps, 'header' | 'details'>
    & {
        title: string;
        level: number;
        components: Array<ICompareComponent>;
    };

export class CompareBox extends Details implements ICompareComponent {
    private _enabled: boolean                            = true;
    private _compareComponents: Array<ICompareComponent> = [];

    constructor (props: CompareBoxProps) {
        const { title, components, level, open = true, ...other } = props;
        super({
            ...other,
            open   : open,
            header : new Component<HTMLHeadingElement>(`h${ level }`, {
                textContent: title,
                className  : css.title,
            }),
            details: new Col({
                rows: components.length
                      ? components
                      : [
                        new Component<HTMLDivElement>('div', {
                            textContent: 'Ничего нет',
                            className  : css.empty,
                        }),
                    ],
            }),
        });
        this._compareComponents = components;
        this.element.classList.add(css.container);
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