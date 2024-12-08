import { IComponent } from '@/shared/component/Component.interface.ts';


export interface ICompareValue<ValueType> extends IComponent<HTMLElement> {
    getValue (): ValueType | null;
}