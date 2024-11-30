import { CompareResult } from '@/entity/compare/v3/Compare.types.ts';


export interface ICompareHeaderV3 {
    setValidationType (type: CompareResult): void;
}