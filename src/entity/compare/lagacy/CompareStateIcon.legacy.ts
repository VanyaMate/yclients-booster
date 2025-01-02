import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareStateIcon.legacy.module.css';


export enum CompareStateIconTypeLegacy {
    IDLE,
    WAITING,
    PROCESS,
    SUCCESS,
    ERROR
}

export interface ICompareStateIconLegacy {
    setState (state: CompareStateIconTypeLegacy): void;
}

export type CompareStateIconLegacyProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        init: CompareStateIconTypeLegacy;
    }

export class CompareStateIconLegacy extends Component<HTMLDivElement> implements ICompareStateIconLegacy {
    constructor (props: CompareStateIconLegacyProps) {
        const { init, ...other } = props;
        super('div', other);
        this.setState(init);
    }

    setState (state: CompareStateIconTypeLegacy): void {
        this.element.className = `${ css.container } ${ this._getClassByState(state) }`;
    }

    private _getClassByState (state: CompareStateIconTypeLegacy): string {
        switch (state) {
            case CompareStateIconTypeLegacy.IDLE:
                return css.idle;
            case CompareStateIconTypeLegacy.WAITING:
                return css.waiting;
            case CompareStateIconTypeLegacy.PROCESS:
                return css.process;
            case CompareStateIconTypeLegacy.SUCCESS:
                return css.success;
            case CompareStateIconTypeLegacy.ERROR:
                return css.error;
            default:
                return css.error;
        }
    }
}