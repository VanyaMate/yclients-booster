import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Logger.module.css';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export class Logger extends Component<HTMLDivElement> implements ILogger {
    private _logsAmount: number = 0;

    constructor (props: ComponentPropsOptional<HTMLDivElement>) {
        super('div', props);
        this.element.classList.add(css.container);
        this.log('Логгер инициализирован');
    }

    success (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.success } ${ css.item }" data-index="${ ++this._logsAmount }"><span>></span><span>${ log }</span></div>`);
    }

    error (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.error } ${ css.item }" data-index="${ ++this._logsAmount }"><span>></span><span>${ log }</span></div>`);
    }

    log (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.neutral } ${ css.item }" data-index="${ ++this._logsAmount }"><span>></span><span>${ log }</span></div>`);
    }

    reset () {
        this.element.innerHTML = '';
        this._logsAmount       = 0;
        this.log('Логгер инициализирован');
    }
}