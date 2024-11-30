import {
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import commonCss from '../CompareRowV3/CompareRowV3.module.css';
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
    private _validating: boolean = true;

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
        this.element.classList.add(commonCss.container);
    }

    get isValid () {
        if (this._validating) {
            return true;
        }

        return true;
    }

    enable (status: boolean): void {
        this._validating = status;
        if (status) {
            this.element.classList.add(commonCss.disable);
        } else {
            this.element.classList.remove(commonCss.disable);
        }
    }
}