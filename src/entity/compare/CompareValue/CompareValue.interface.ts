import { IComponent } from '@/shared/component/Component.interface.ts';
import { Nullable } from '@/types/Nullable.ts';


export interface ICompareValue<ValueType> extends IComponent<HTMLElement> {
    getValue (): Nullable<ValueType>;
}