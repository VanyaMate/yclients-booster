import { IComponent } from '@/shared/component/Component.interface.ts';


export enum CompareResult {
    VALID,
    NO_VALID,
    NO_EXIST
}

export enum CompareType {
    ALL      = 'all',
    ITEM     = 'item',
    CHILDREN = 'children',
    NONE     = 'none'
}

export enum CompareProcess {
    NONE    = 'none',
    IDLE    = 'idle',
    PROCESS = 'process',
    SUCCESS = 'success',
    ERROR   = 'error'
}

export interface ICompareComponent extends IComponent<HTMLElement> {
    isValid: boolean;

    enable (status: boolean): void;
}