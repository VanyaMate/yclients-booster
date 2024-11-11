import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Modal.module.css';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


const BODY_MODAL_COUNT_ATTRIBUTE = 'data-modal-count';

export type ModalProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        content: Component<HTMLElement>;
        label?: string;
    };

export type ModalOnChangeCallback = (state: boolean) => void;

export class Modal extends Component<HTMLDivElement> {
    private readonly _onChangeCallbacks: Array<ModalOnChangeCallback> = [];

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
            styleType: ButtonStyleType.PRIMARY,
            quad     : true,
        }).insert(closeButtonContainer, 'beforeend');
    }

    show () {
        this.insert(document.body, 'beforeend');
        this._incrementModalCount();
        this._onChangeHandler(true);
        document.body.classList.add(css.scrollDisable);
        document.documentElement.classList.add(css.scrollDisable);
    }

    hide () {
        this.remove();
        const modalCount = this._decrementModalCount();
        this._onChangeHandler(false);

        if (!modalCount) {
            document.body.classList.remove(css.scrollDisable);
            document.documentElement.classList.remove(css.scrollDisable);
        }
    }

    onChange (callback: ModalOnChangeCallback) {
        this._onChangeCallbacks.push(callback);
        return () => {
            const index = this._onChangeCallbacks.indexOf(callback);
            if (index) {
                this._onChangeCallbacks.splice(index, 1);
            }
        };
    }

    private _onChangeHandler (showing: boolean) {
        this._onChangeCallbacks.forEach((callback) => callback(showing));
    }

    private _incrementModalCount () {
        const currentCount = this._getCurrentBodyCount();
        document.body.setAttribute(BODY_MODAL_COUNT_ATTRIBUTE, (currentCount + 1).toString());
        return currentCount + 1;
    }

    private _decrementModalCount () {
        const currentCount = this._getCurrentBodyCount();
        document.body.setAttribute(BODY_MODAL_COUNT_ATTRIBUTE, (currentCount - 1).toString());
        return currentCount - 1;
    }

    private _getCurrentBodyCount () {
        return Number(document.body.getAttribute(BODY_MODAL_COUNT_ATTRIBUTE) ?? '0');
    }
}