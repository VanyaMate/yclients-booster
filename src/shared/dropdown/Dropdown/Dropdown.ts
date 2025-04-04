import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import css from './Dropdown.module.css';


export const DropdownHideEvent = new Event('dropdown-hide', { bubbles: true });

export type DropdownProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        buttonProps: ButtonProps;
        content: Component<HTMLElement>;
        stopPropagation?: boolean;
    };

export class Dropdown extends Component<HTMLDivElement> {
    private readonly _hideOnDomClickHandler: (event: MouseEvent) => void;
    private readonly _stopPropagation: boolean;

    constructor (props: DropdownProps) {
        const { buttonProps, content, stopPropagation, ...other } = props;
        let button: Button;
        super('div', other, [
            button = new Button(buttonProps),
            new Component<HTMLDivElement>(
                'div',
                { className: css.dropdown },
                [ content ],
            ),
        ]);
        this._stopPropagation = stopPropagation ?? false;
        this.element.classList.add(css.container);
        this._hideOnDomClickHandler = this._hideOnDocumentClick.bind(this);
        button.element.addEventListener('click', this._toggle.bind(this));
        this.element.addEventListener(DropdownHideEvent.type, this.hide.bind(this));
    }

    private _toggle () {
        if (this.element.classList.toggle(css.opened)) {
            document.addEventListener('click', this._hideOnDomClickHandler);
        } else {
            document.removeEventListener('click', this._hideOnDomClickHandler);
        }
    }

    public show () {
        if (!this.element.classList.contains(css.opened)) {
            this.element.classList.add(css.opened);
            document.addEventListener('click', this._hideOnDomClickHandler);
        }
    }

    public hide (event: Event) {
        if (this._stopPropagation) {
            event.stopPropagation();
        }

        this.element.classList.remove(css.opened);
        document.removeEventListener('click', this._hideOnDomClickHandler);
    }

    private _hideOnDocumentClick (event: MouseEvent) {
        let target: HTMLElement | null = event.target as HTMLElement;

        if (target) {
            while (target) {
                if (target === this.element) {
                    return;
                }

                target = target.parentElement;
            }

            this.hide(event);
        }
    }
}