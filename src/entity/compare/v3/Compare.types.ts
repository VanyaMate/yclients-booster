import { IComponent } from '@/shared/component/Component.interface.ts';


export enum CompareType {
    VALID,
    NO_VALID,
    NO_EXIST
}

export interface ICompareComponent extends IComponent<HTMLElement> {
    isValid: boolean;
}