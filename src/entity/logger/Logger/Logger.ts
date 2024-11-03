import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Logger.module.css';


export class Logger extends Component<HTMLDivElement> {
    constructor (props: ComponentPropsOptional<HTMLDivElement>) {
        super('div', props);
        this.element.classList.add(css.container);
        this.log('Логгер инициализирован');
    }

    success (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.success } ${ css.item }"><span>></span><span>${ log }</span></div>`);
    }

    error (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.error } ${ css.item }"><span>></span><span>${ log }</span></div>`);
    }

    log (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.neutral } ${ css.item }"><span>></span><span>${ log }</span></div>`);
    }

    reset () {
        this.element.innerHTML = '';
    }
}