import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export type GoodCategoryCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCategory: GoodsCategoryFullData;
    }

export class GoodCategoryCompareComponent extends CompareComponent<GoodsCategoryFullData> {
    protected _action (parentId: string | null): Promise<GoodsCategoryFullData | null> {
        console.log('ParentId', parentId);
        throw new Error('Method not implemented.');
    }

    protected _render (): void {
        this._beforeRender();

        this._compareRows     = [];
        this._compareChildren = [];

        this._beforeEndRender();
    }
}