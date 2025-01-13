import {
    GoodCategoriesMapper,
    GoodsCategoryFullData, GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export type GoodsCategoriesFullCopyData = {
    list: Array<GoodsCategoryTreeFullData>;
    mapper: GoodCategoriesMapper;
}

export const goodCategoriesFullListToCopyDataConverter = function (list: Array<GoodsCategoryFullData>): GoodsCategoriesFullCopyData {
    const temporally: any                       = {}; // len' tipizirovat
    const response: GoodsCategoriesFullCopyData = {
        mapper: {},
        list  : [],
    };

    let item: GoodsCategoryFullData;
    for (let i = 0; i < list.length; i++) {
        item = list[i];

        temporally[item.id] = {
            ...item,
            children: temporally[item.id]?.children ?? [],
        };

        if (item.parent?.id && item.parent.id !== '0') {
            const parent = temporally[item.parent.id];
            if (parent) {
                parent.children.push(temporally[item.id]!);
            } else {
                temporally[item.parent.id] = { children: [ temporally[item.id]! ] };
            }
        } else {
            response.mapper[item.id] = temporally[item.id]!;
        }
    }

    response.list = Object.values(response.mapper);
    return response;
};