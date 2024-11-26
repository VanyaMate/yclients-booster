import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareRowV3,
} from '@/entity/compare/v3/CompareRowV3/CompareRowV3.interface.ts';
import css from './CompareRowV3.module.css';


export type CompareRowV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataOriginal: string;
        label: string;
        dataCompare?: string;
    };

export class CompareRowV3 extends Component<HTMLDivElement> implements ICompareRowV3 {
    private readonly _isValid: boolean;

    constructor (props: CompareRowV3Props) {
        const { dataCompare, dataOriginal, label, ...other } = props;
        super('div', other, [
            new Component<HTMLDivElement>('div', { textContent: dataOriginal }),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', { textContent: dataCompare ?? '-' }),
        ]);
        this.element.classList.add(css.container);
        this._isValid = dataCompare === dataOriginal;

        if (!this._isValid) {
            this.element.classList.add(css.invalid);
        }
    }

    get isValid () {
        return this._isValid;
    }
}