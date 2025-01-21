import { IComponent } from '@/shared/component/Component.interface.ts';


export interface IActionComponent<Type extends HTMLElement, ResponseType, DataType extends any> extends IComponent<Type> {
    getAction (): (data?: DataType) => Promise<ResponseType>;
}