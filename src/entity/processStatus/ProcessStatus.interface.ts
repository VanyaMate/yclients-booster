import { IComponent } from '@/shared/component/Component.interface.ts';


export enum ProcessStatusType {
    NONE    = 'none',
    IDLE    = 'idle',
    PROCESS = 'process',
    SUCCESS = 'success',
    ERROR   = 'error'
}

export interface IProcessStatus {
    setStatus (status: ProcessStatusType): void;
}

export interface IProcessStatusComponent extends IProcessStatus,
                                                 IComponent<HTMLDivElement> {
}