import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareProcess.legacy.module.css';
import {
    CompareStateIconLegacy,
    CompareStateIconTypeLegacy,
    ICompareStateIconLegacy,
} from '@/entity/compare/lagacy/CompareStateIcon.legacy.ts';


export type CompareProcessLegacyProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        init: CompareStateIconTypeLegacy;
        content: Component<HTMLElement>;
    }

export class CompareProcessLegacy extends Component<HTMLDivElement> implements ICompareStateIconLegacy {
    private _icon: CompareStateIconLegacy;

    constructor (props: CompareProcessLegacyProps) {
        const { init, content, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._icon = new CompareStateIconLegacy({ init });
        this._icon.insert(this.element, 'afterbegin');
        content.insert(this.element, 'beforeend');
    }

    setState (state: CompareStateIconTypeLegacy): void {
        this._icon.setState(state);
    }
}