import {
    CompareProcess,
    CompareResult, CompareType, CompareWith,
    ICompareComponent,
} from '@/entity/compare/Compare.types.ts';


export interface ICompareHeader extends ICompareComponent {
    setValidationType (type: CompareResult): void;

    setProcessType (type: CompareProcess): void;

    setCompareType (type: CompareType): void;

    setCompareWith (type: CompareWith): void;

    getType (): string;
}