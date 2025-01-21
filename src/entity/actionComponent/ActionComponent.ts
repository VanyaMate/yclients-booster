import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IActionComponent,
} from '@/entity/actionComponent/ActionComponent.interface.ts';


export type ActionComponentProps = ComponentPropsOptional<HTMLDivElement>;

export abstract class ActionComponent<ResponseType, DataType extends any> extends Component<HTMLDivElement> implements IActionComponent<HTMLDivElement, ResponseType, DataType> {
    protected constructor (props: ActionComponentProps) {
        super('div', props);
    }

    abstract getAction (): (data?: DataType) => Promise<ResponseType>;
}