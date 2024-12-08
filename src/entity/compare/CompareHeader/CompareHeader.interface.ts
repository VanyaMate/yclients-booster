import {
    CompareProcess,
    CompareResult,
    ICompareComponent,
} from '@/entity/compare/Compare.types.ts';


export interface ICompareHeader extends ICompareComponent {
    setValidationType (type: CompareResult): void;

    setProcessType (type: CompareProcess): void;
}