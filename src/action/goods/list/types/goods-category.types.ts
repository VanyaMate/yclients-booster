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

export type GoodsCategoryFullData = {
    id: string;
    isChainCategory: boolean;
    title: string;
    article: string;
    comment: string;
    parent: GoodsCategoryShortData;
}