import { IComponent } from '@/shared/component/Component.interface.ts';
import {
    ICompareHeader,
} from '@/entity/compare/CompareHeader/CompareHeader.interface.ts';


export enum CompareWith {
    NONE,
    CHILDREN,
}

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

/**
 * Любой компонент который имеет возможность сравниваться
 */
export interface ICompareComponent extends IComponent<HTMLElement> {
    isValid: boolean;

    enable (status: boolean): void;
}

/**
 * Компонент который может сравниваться, имеет header и дочерние элементы
 */
export interface ICompareEntity<Data> extends ICompareComponent {
    getHeader (): ICompareHeader | null;

    getChildren (): Array<ICompareEntity<any>>;

    getAction (data?: any): () => Promise<Data | null>;

    revalidateWithParents (uniqueData?: any): void;

    setUniqueData (uniqueData?: any): void;
}