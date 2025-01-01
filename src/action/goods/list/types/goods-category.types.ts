export type GoodsCategoryCreateData = {
    title: string;
    pid?: string;
    article?: string;
    comment?: string;
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
    parent: GoodsCategoryShortData;
}

export type GoodIds = {
    id: string;
    categoryId: string;
}