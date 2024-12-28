import { ICompareComponent } from '@/entity/compare/Compare.types.ts';
import {
    Component,
} from '@/shared/component/Component.ts';
import css from './CompareBoxWithoutValidation.module.css';
import { IComponent } from '@/shared/component/Component.interface.ts';
import { CompareBoxProps } from '@/entity/compare/CompareBox/CompareBox.ts';


export type CompareBoxWithoutValidationProps =
    Omit<CompareBoxProps, 'components'>
    & {
        components: Array<IComponent<HTMLElement>>;
    };

export class CompareBoxWithoutValidation extends Component<HTMLDivElement> implements ICompareComponent {
    constructor (props: CompareBoxWithoutValidationProps) {
        const { components, level, title, ...other } = props;
        super('div', other, components);
        this.element.classList.add(css.container);

        new Component<HTMLHeadingElement>(`h${ level }`, {
            textContent: title,
            className  : css.title,
        })
            .insert(this.element, 'afterbegin');

        if (components.length === 0) {
            new Component<HTMLDivElement>('div', {
                textContent: 'Ничего нет',
                className  : css.empty,
            })
                .insert(this.element, 'beforeend');
        }
    }

    get isValid () {
        return true;
    };

    enable (status: boolean): void {
        if (status) {
            this.element.classList.remove(css.disabled);
        } else {
            this.element.classList.add(css.disabled);
        }
    }
}