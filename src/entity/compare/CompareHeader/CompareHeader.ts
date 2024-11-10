import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from '@/entity/compare/CompareRow/CompareRow.module.css';
import { Select } from '@/shared/input/Select/Select.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export enum CompareState {
    VALID,
    WARNING,
    CRITICAL
}

export type CompareHeaderProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        titleFrom: string;
        titleTo?: string | null;
        variants?: Array<string>;
    };

export class CompareHeader extends Component<HTMLDivElement> {
    private _modal: Modal | null = null;

    constructor (props: CompareHeaderProps) {
        const { titleFrom, titleTo, variants = [], ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this.element.innerHTML = `
            <span>${ titleFrom }</span>
            <span class="${ css.label }"></span>
        `;

        if (typeof titleTo !== 'string') {
            this.element.classList.add(css.critical);
            this.element.innerHTML += `<span>-</span>`;
        } else {
            if (titleFrom !== titleTo) {
                this.element.classList.add(css.warning);
                this.element.title = titleTo;
            } else {
                this.element.classList.add(css.valid);
            }

            if (variants.length) {
                new Button({
                    innerHTML: titleTo,
                    onclick  : () => {
                        if (this._modal) {
                            this._modal.show();
                        } else {
                            const select = new Select({
                                defaultLabel: titleTo,
                                defaultValue: titleTo,
                                list        : variants.map((variant) => ({
                                    label   : variant,
                                    value   : variant,
                                    selected: false,
                                })),
                                withSearch  : true,
                                styleType   : ButtonStyleType.PRIMARY,
                            });
                            select.show();
                            this._modal = new Modal({
                                content: select,
                            });
                            this._modal.show();
                        }
                    },
                }).insert(this.element, 'beforeend');
            }
        }
    }
}