import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './Image.module.css';


export type ImageProps =
    ComponentPropsOptional<HTMLImageElement>
    & {
        containerClassName?: string;
    };

export class Image extends Component<HTMLDivElement> {
    constructor (props: ImageProps) {
        const { containerClassName, ...other } = props;
        super('div', { className: containerClassName }, [
            new Component<HTMLImageElement>('img', other),
        ]);
        this.element.classList.add(css.container);
    }
}