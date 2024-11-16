import {IComponent} from "@/shared/component/Component.interface.ts";

export type PromiseCallback = () => Promise<any>;

export interface IPromisableComponent<T> extends IComponent<T> {
    getPromises(): Array<PromiseCallback>;
}