import {
    CompareProcess,
    CompareResult,
    ICompareComponentV3,
} from '@/entity/compare/v3/Compare.types.ts';


export interface ICompareHeaderV3 extends ICompareComponentV3 {
    setValidationType (type: CompareResult): void;

    setProcessType (type: CompareProcess): void;
}