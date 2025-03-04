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
    private _empty: HTMLElement | null;

    constructor (props: TableProps) {
        const { header, ...other } = props;
        super('table', other);
        this.element.innerHTML = `<thead></thead><tbody><tr class="${ css.empty }"><td colspan="${ header.length }">Ничего не добавлено</td></tr></tbody>`;
        this.element.classList.add(css.container);
        this._thead = this.element.querySelector('thead')!;
        this._tbody = this.element.querySelector('tbody')!;
        this._empty = this.element.querySelector(`.${ css.empty }`)!;
        this.setHeader(header);
    }

    addRow (items: Array<string>) {
        if (this._empty) {
            this._empty.remove();
            this._empty = null;
        }

        this._tbody.insertAdjacentHTML('beforeend', `
            <tr>
                ${ items.map((item) => `<td>${ item }</td>`).join('') }
            </tr>
        `);
    }

    updateRow (rowIndex: number, items: Array<string>) {
        const row = this._tbody.children[rowIndex];
        if (row) {
            row.innerHTML = items.map((item) => `<td>${ item }</td>`).join('');
        }
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