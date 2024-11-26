import { IComponent } from '@/shared/component/Component.interface.ts';


export enum CompareValidType {
    VALID,
    NO_VALID,
    NO_EXIST
}

export interface ICompareItem extends ICompare {
    action<T> (): Promise<T>;
}

export interface ICompare {
    getValidationType (): CompareValidType;
}

export interface ICompareComponent<T extends HTMLElement> extends ICompare,
                                                                  IComponent<T> {
}