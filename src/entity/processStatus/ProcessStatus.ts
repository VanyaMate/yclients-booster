import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IProcessStatusComponent,
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import css from './ProcessStatus.module.css';


export type ProcessStatusProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        initialStatus: ProcessStatusType;
    };

export class ProcessStatus extends Component<HTMLDivElement> implements IProcessStatusComponent {
    constructor (props: ProcessStatusProps) {
        const { initialStatus, ...other } = props;
        super('div', other);
        this.setStatus(initialStatus);
    }

    setStatus (status: ProcessStatusType): void {
        switch (status) {
            case ProcessStatusType.ERROR:
                this.element.className = `${ css.container } ${ css.error }`;
                break;
            case ProcessStatusType.SUCCESS:
                this.element.className = `${ css.container } ${ css.success }`;
                break;
            case ProcessStatusType.PROCESS:
                this.element.className = `${ css.container } ${ css.process }`;
                break;
            case ProcessStatusType.IDLE:
                this.element.className = `${ css.container } ${ css.idle }`;
                break;
            case ProcessStatusType.NONE:
                this.element.className = `${ css.container } ${ css.none }`;
                break;
            default:
                this.element.className = `${ css.container } ${ css.none }`;
                break;
        }
    }
}