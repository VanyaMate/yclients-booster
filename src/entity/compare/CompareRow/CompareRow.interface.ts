import { IComponent } from '@/shared/component/Component.interface.ts';


export interface ICompareItem<T> extends IComponent<T> {
    getValid (): boolean;
}