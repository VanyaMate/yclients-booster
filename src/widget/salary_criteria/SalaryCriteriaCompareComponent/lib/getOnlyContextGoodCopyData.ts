import {
    GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export const getOnlyContextGoodCopyData = function (originalTree: GoodsCategoryTreeFullData, categoriesIds: Array<string>, goodIds: Array<string>): GoodsCategoryTreeFullData {
    return {
        ...originalTree,
        children: originalTree.children
            .filter((child) => categoriesIds.includes(child.id))
            .map((child) => getOnlyContextGoodCopyData(child, categoriesIds, goodIds)),
        goods   : originalTree.goods
            .filter((child) => goodIds.includes(child.id)),
    };
};