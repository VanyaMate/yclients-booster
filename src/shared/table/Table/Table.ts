import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Table.module.css';


export type TableProps =
    {
        header: Array<string>;
    }
    & ComponentPropsOptional<HTMLTableElement>;

export class Table extends Component<HTMLTableElement> {
    constructor (props: TableProps) {
        const { header, ...other } = props;
        super('table', other);
        this.element.classList.add(css.container);
        this.setHeader(header);
    }

    addRow (items: Array<string>) {
        this.element.insertAdjacentHTML('beforeend', `
            <tr>
                ${ items.map((item) => `<td>${ item }</td>`).join('') }
            </tr>
        `);
    }

    private setHeader (header: Array<string>) {
        this.element.insertAdjacentHTML('afterbegin', `
            <tr>
                ${ header.map((item) => `<th>${ item }</th>`).join('') }
            </tr>
        `);
    }
}