import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Logger.module.css';


export class Logger extends Component<HTMLDivElement> {
    constructor (props: ComponentPropsOptional<HTMLDivElement>) {
        super('div', props);
        this.element.classList.add(css.container);
    }

    success (log: string) {
        this.element.insertAdjacentHTML('beforeend', `<div class="${ css.success }">Успешно: ${ log }</div>`);
    }

    error (log: string) {
        this.element.insertAdjacentHTML('beforeend', `<div class="${ css.error }">Ошибка: ${ log }</div>`);
    }

    log (log: string) {
        this.element.insertAdjacentHTML('beforeend', `<div class="${ css.neutral }">${ log }</div>`);
    }

    reset () {
        this.element.innerHTML = '';
    }
}