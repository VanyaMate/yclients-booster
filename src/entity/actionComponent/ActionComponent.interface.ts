import { IComponent } from '@/shared/component/Component.interface.ts';


export interface IActionComponent<Type extends HTMLElement> extends IComponent<Type> {
    getAction<ResponseType, DataType extends any> (): (data?: DataType) => Promise<ResponseType>;
}