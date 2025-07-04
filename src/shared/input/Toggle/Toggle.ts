import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Toggle.module.css';


export type ToggleProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: boolean;
        onChange?: (status: boolean) => void;
        executeOnChangeAfterInit?: boolean;
    };

export class Toggle extends Component<HTMLDivElement> {
    private _value: boolean;

    constructor (props: ToggleProps) {
        const id = `id-${ Math.random().toString(16) }`;
        const {
                  value, onChange, executeOnChangeAfterInit, textContent,
                  ...other
              }  = props;
        super('div', other, [
            new Component<HTMLInputElement>('input', {
                type    : 'checkbox',
                checked : value,
                id      : id,
                onchange: (event: Event) => {
                    this._value = !this._value;
                    onChange?.((event.target as HTMLInputElement).checked);
                },
            }),
            new Component<HTMLLabelElement>('label', {
                htmlFor  : id,
                className: css.toggle,
            }),
        ]);

        if (textContent) {
            new Component<HTMLLabelElement>('label', {
                htmlFor    : id,
                textContent: textContent,
                className  : css.label,
            })
                .insert(this.element, 'beforeend');
        }

        this._value = value;
        this.element.classList.add(css.container);

        if (executeOnChangeAfterInit) {
            onChange?.(this._value);
        }
    }

    getValue (): boolean {
        return this._value;
    }

    setDisable (state: boolean) {
        if (state) {
            this.element.classList.add(css.disabled);
        } else {
            this.element.classList.remove(css.disabled);
        }
    }
}