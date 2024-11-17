import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareStateIcon.module.css';


export enum CompareStateIconType {
    IDLE,
    WAITING,
    PROCESS,
    SUCCESS,
    ERROR
}

export interface ICompareStateIcon {
    setState (state: CompareStateIconType): void;
}

export type CompareStateIconProps = ComponentPropsOptional<HTMLDivElement> & {
    init: CompareStateIconType;
}

export class CompareStateIcon extends Component<HTMLDivElement> implements ICompareStateIcon {
    constructor (props: CompareStateIconProps) {
        const { init, ...other } = props;
        super('div', other);
        this.setState(init);
    }

    setState (state: CompareStateIconType): void {
        this.element.className = `${ css.container } ${ this._getClassByState(state) }`;
    }

    private _getClassByState (state: CompareStateIconType): string {
        switch (state) {
            case CompareStateIconType.IDLE:
                return css.idle;
            case CompareStateIconType.WAITING:
                return css.waiting;
            case CompareStateIconType.PROCESS:
                return css.process;
            case CompareStateIconType.SUCCESS:
                return css.success;
            case CompareStateIconType.ERROR:
                return css.error;
            default:
                return css.error;
        }
    }
}