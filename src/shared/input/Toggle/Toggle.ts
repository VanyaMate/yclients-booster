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
    };

export class Toggle extends Component<HTMLDivElement> {
    constructor (props: ToggleProps) {
        const id                            = `id-${ Math.random().toString(16) }`;
        const { value, onChange, ...other } = props;
        super('div', other, [
            new Component<HTMLInputElement>('input', {
                type    : 'checkbox',
                checked : value,
                id      : id,
                onchange: (event: Event) => onChange?.((event.target as HTMLInputElement).checked),
            }),
            new Component<HTMLLabelElement>('label', {
                htmlFor: id,
            }),
        ]);
        this.element.classList.add(css.container);
    }
}