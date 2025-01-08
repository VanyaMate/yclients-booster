import {
    CompareProcess,
    CompareResult, CompareType, CompareWith,
    ICompareComponent, ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
import {
    CompareHeaderActivateHandler,
} from '@/entity/compare/CompareHeader/CompareHeader.ts';


export interface ICompareHeader extends ICompareComponent {
    setValidationType (type: CompareResult): void;

    setProcessType (type: CompareProcess): void;

    setCompareType (type: CompareType): void;

    setCompareWith (type: CompareWith): void;

    getType (): string;

    onActivateAll (handler: CompareHeaderActivateHandler): void;

    onActivateOnlyChildren (handler: CompareHeaderActivateHandler): void;

    onActivateOnlyItem (handler: CompareHeaderActivateHandler): void;

    onDeactivate (handler: CompareHeaderActivateHandler): void;

    setParent (parent: ICompareEntity<any>): void;
}