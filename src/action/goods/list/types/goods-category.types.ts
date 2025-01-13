export type GoodsCategoryCreateData = {
    title: string;
    pid?: string;
    article?: string;
    comment?: string;
}

export type GoodsCategoryUpdateData = {
    title: string;
    pid: string;
    article: string;
    comment: string;
}

export type GoodsCategoryShortData = {
    id: string;
    title: string;
}

export type GoodsCategoryChainData = {
    id: number;
    is_chain: boolean;
    parent_category_id: number;
    title: string;
}

export type GoodsCategoryFullData = {
    id: string;
    isChainCategory: boolean;
    title: string;
    article: string;
    comment: string;
    parent: GoodsCategoryShortData | null;
}

export type GoodIds = {
    id: string;
    categoryId: string;
}

export type GoodsCategoryTreeFullData =
    GoodsCategoryFullData
    & {
        children: Array<GoodsCategoryTreeFullData>;
    };

export type GoodCategoriesMapper = Record<string, GoodsCategoryTreeFullData>;
export type GoodCategoriesCopyData = {
    mapper: GoodCategoriesMapper;
    list: Array<GoodsCategoryTreeFullData>;
}