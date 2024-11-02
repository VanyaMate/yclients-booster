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
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.success }">> ${ log }</div>`);
    }

    error (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.error }">> ${ log }</div>`);
    }

    log (log: string) {
        this.element.insertAdjacentHTML('afterbegin', `<div class="${ css.neutral }">> ${ log }</div>`);
    }

    reset () {
        this.element.innerHTML = '';
    }
}