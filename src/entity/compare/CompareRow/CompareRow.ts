import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareRow.module.css';
import {
    ICompareComponent,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';


export type CompareRowProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        label: string;
        valueFrom: string | null | undefined;
        valueTo?: string | null;
    };

export class CompareRow extends Component<HTMLDivElement> implements ICompareComponent<HTMLDivElement> {
    private readonly _valid: boolean = true;

    constructor (props: CompareRowProps) {
        const { valueFrom, valueTo, label, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this.element.innerHTML = `
            <span>${ valueFrom ?? '-' }</span>
            <span class="${ css.label }">${ label }</span>
            <span>${ valueTo ?? '-' }</span>
        `;

        if (typeof valueTo !== 'string' && typeof valueFrom === 'string') {
            this.element.classList.add(css.critical);
            this._valid = false;
        } else if (valueFrom !== valueTo) {
            this.element.classList.add(css.critical);
            this._valid = false;
        } else {
            this.element.classList.add(css.valid);
        }
    }

    getValid (): boolean {
        return this._valid;
    }
}