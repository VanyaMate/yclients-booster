import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareRowV3.module.css';
import {
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';


export type CompareRowV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetData: string;
        label: string;
        clientData?: string;
    };

export class CompareRowV3 extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _isValid: boolean;
    private _validating: boolean = true;

    constructor (props: CompareRowV3Props) {
        const { clientData, targetData, label, ...other } = props;
        const isEmpty                                     = targetData.length === 0;
        const isClientEmpty                               = clientData
                                                            ? (clientData?.length === 0)
                                                            : true;
        super('div', other, [
            new Component<HTMLDivElement>('div', {
                textContent: isEmpty ? 'Пусто' : targetData,
                className  : isEmpty ? css.empty : '',
            }),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {
                textContent: isClientEmpty ? 'Пусто' : clientData,
                className  : isClientEmpty ? css.empty : '',
            }),
        ]);
        this.element.classList.add(css.container);
        this._isValid = clientData === targetData;

        if (!this._isValid) {
            this.element.classList.add(css.invalid);
        }
    }

    get isValid () {
        if (this._validating) {
            return this._isValid;
        }
        return true;
    }

    enable (status: boolean): void {
        this._validating = status;
        if (status) {
            this.element.classList.add(css.disable);
        } else {
            this.element.classList.remove(css.disable);
        }
    }
}