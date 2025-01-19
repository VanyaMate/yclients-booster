import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IActionComponent,
} from '@/entity/actionComponent/ActionComponent.interface.ts';


export type ActionComponentProps = ComponentPropsOptional<HTMLDivElement>;

export abstract class ActionComponent extends Component<HTMLDivElement> implements IActionComponent<HTMLDivElement> {
    protected constructor (props: ActionComponentProps) {
        super('div', props);
    }

    abstract getAction<ResponseType, DataType extends unknown> (): (data?: DataType) => Promise<ResponseType>;
}