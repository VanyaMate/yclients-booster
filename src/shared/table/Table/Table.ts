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
    private _thead: HTMLElement;
    private _tbody: HTMLElement;

    constructor (props: TableProps) {
        const { header, ...other } = props;
        super('table', other);
        this.element.innerHTML = `<thead></thead><tbody></tbody>`;
        this.element.classList.add(css.container);
        this._thead = this.element.querySelector('thead')!;
        this._tbody = this.element.querySelector('tbody')!;
        this.setHeader(header);
    }

    addRow (items: Array<string>) {
        this._tbody.insertAdjacentHTML('beforeend', `
            <tr>
                ${ items.map((item) => `<td>${ item }</td>`).join('') }
            </tr>
        `);
    }

    private setHeader (header: Array<string>) {
        const tr     = document.createElement('tr');
        const titles = header.map((title) => `<th>${ title }</th>`);
        tr.insertAdjacentHTML('afterbegin', titles.join(''));
        tr.querySelectorAll('th').forEach((title, index) => {
            title.addEventListener('click', () => this.copyColumn(index));
        });

        this._thead.insertAdjacentElement('afterbegin', tr);
    }

    private copyColumn (index: number) {
        const rows    = [ ...this._tbody.querySelectorAll('tr') ];
        const headers = [ ...this._thead.querySelectorAll('th') ];
        let string    = '';

        for (let i = 0; i < rows.length; i++) {
            string += (rows[i].children[index].textContent?.trim() ?? '') + '\n';
        }

        navigator.clipboard.writeText(string.trim())
            .then(() => {
                headers[index].classList.add(css.success);
                setTimeout(() => {
                    headers[index].classList.remove(css.success);
                }, 1000);
            })
            .catch(() => {
                headers[index].classList.add(css.error);
                setTimeout(() => {
                    headers[index].classList.remove(css.error);
                }, 1000);
            });
    }
}