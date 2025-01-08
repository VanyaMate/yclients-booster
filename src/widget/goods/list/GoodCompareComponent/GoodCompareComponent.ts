import {
    CompareComponent,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { GoodData } from '@/action/goods/types/good.types.ts';


export class GoodCompareComponent extends CompareComponent<GoodData> {
    protected _action (): Promise<GoodData | null> {
        throw new Error('Method not implemented.');
    }

    protected _render (): void {
        throw new Error('Method not implemented.');
    }
}