import { ICompareComponent } from '@/entity/compare/v3/Compare.types.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import common from '../CompareRowV3/CompareRowV3.module.css';
import css from './CompareImageRowV3.module.css';
import { Image } from '@/shared/image/Image/Image.ts';


export type CompareImageRowV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientImage?: string;
        targetImage?: string;
        label: string;
    };

export class CompareImageRowV3 extends Component<HTMLDivElement> implements ICompareComponent {
    constructor (props: CompareImageRowV3Props) {
        const { clientImage, targetImage, label, ...other } = props;
        super('div', other, [
            new Image({
                src      : targetImage,
                className: css.image,
                loading  : 'lazy',
            }),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Image({
                src      : clientImage,
                className: css.image,
                loading  : 'lazy',
            }),
        ]);
        this.element.classList.add(common.container);
    }

    get isValid () {
        return true;
    }
}