import { IComponent } from '@/shared/component/Component.interface.ts';


export interface ICompareComponent<T> extends IComponent<T> {
    getValid (): boolean;
}