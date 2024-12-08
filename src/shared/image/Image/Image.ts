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
    public image: Component<HTMLImageElement>;

    constructor (props: ImageProps) {
        const { containerClassName, ...other } = props;
        let image;
        super('div', { className: containerClassName }, [
            image = new Component<HTMLImageElement>('img', other),
        ]);
        this.image = image;
        this.element.classList.add(css.container);
    }
}