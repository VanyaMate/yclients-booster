import {
    CompareStateIcon,
    CompareStateIconType, ICompareStateIcon,
} from '@/entity/compare/CompareStateIcon/CompareStateIcon.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareProcess.module.css';


export type CompareProcessProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        init: CompareStateIconType;
        content: Component<HTMLElement>;
    }

export class CompareProcess extends Component<HTMLDivElement> implements ICompareStateIcon {
    private _icon: CompareStateIcon;

    constructor (props: CompareProcessProps) {
        const { init, content, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._icon = new CompareStateIcon({ init });
        this._icon.insert(this.element, 'afterbegin');
        content.insert(this.element, 'beforeend');
    }

    setState (state: CompareStateIconType): void {
        this._icon.setState(state);
    }
}