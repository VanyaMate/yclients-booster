import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Modal.module.css';
import { Button } from '@/shared/buttons/Button/Button.ts';


export type ModalProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        content: Component<HTMLElement>;
        label?: string;
    }

export class Modal extends Component<HTMLDivElement> {
    constructor (props: ModalProps) {
        const { content, label, ...other } = props;
        super('div', other);

        this.element.innerHTML = `
            <div class="${ css.back }"></div>
            <div class="${ css.modal }">
                <header>
                    <h2>${ label }</h2>
                </header>
                <div class="${ css.content }"></div>
            </div>
        `;
        this.element.classList.add(css.container);
        this.element.querySelector(`.${ css.back }`)!.addEventListener('click', this.hide.bind(this));

        const closeButtonContainer = this.element.querySelector(`header`)!;
        const contentContainer     = this.element.querySelector(`.${ css.content }`)!;

        content.insert(contentContainer, 'afterbegin');
        new Button({
            innerHTML: 'X',
            onclick  : this.hide.bind(this),
            isPrimary: true,
            quad     : true,
        }).insert(closeButtonContainer, 'beforeend');
    }

    show () {
        this.insert(document.body, 'beforeend');
        document.body.classList.add(css.scrollDisable);
        document.documentElement.classList.add(css.scrollDisable);
    }

    hide () {
        this.remove();
        document.body.classList.remove(css.scrollDisable);
        document.documentElement.classList.remove(css.scrollDisable);
    }
}