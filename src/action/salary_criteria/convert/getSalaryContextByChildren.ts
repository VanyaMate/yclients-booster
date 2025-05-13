import {
    SalaryCriteriaContext, SalaryCriteriaContextItem,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';


export type GetSalaryCriteriaContextProps = {
    serviceCategoryList: Array<SettingsServiceCategoryDataWithChildren>;
    partOfServiceCategoryList: Array<SettingsServiceCategoryDataWithChildren>;
    goodsCategoryList: Array<GoodsCategoryTreeFullData>;
    partOfGoodsCategoryList: Array<GoodsCategoryTreeFullData>;
}


const getGoodCategoryIdsWithGoods = function (categories: GoodsCategoryTreeFullData[]): Array<string> {
    let result: Array<string> = [];

    while (categories.length) {
        let newCategories: GoodsCategoryTreeFullData[] = [];

        categories.forEach((category) => {
            if (category.goods.length) {
                result.push(category.id);
            } else if (category.children.length) {
                newCategories.push(...category.children);
            }
        });

        categories = newCategories;
    }

    return result;
};

export const getSalaryContextByChildren = function (props: GetSalaryCriteriaContextProps): SalaryCriteriaContext {
    console.log('getSalaryContextByChildren', props);

    const context: SalaryCriteriaContext = {};

    if (props.serviceCategoryList.length || props.partOfServiceCategoryList.length) {
        context.services = { categories: [], items: [] };

        context.services!.categories = props.serviceCategoryList.map((category) => ({
            category: category.id.toString(),
        }));
        context.services!.items      = props.partOfServiceCategoryList
            .reduce(
                (items, category) =>
                    items.concat(category.children.map((service) => ({
                        category: service.category_id.toString(),
                        item    : service.id.toString(),
                    })))
                , [] as Array<SalaryCriteriaContextItem>,
            );
    }

    if (props.goodsCategoryList.length || props.partOfGoodsCategoryList.length) {
        context.goods = { categories: [], items: [] };

        context.goods!.categories = getGoodCategoryIdsWithGoods(props.goodsCategoryList).map((category) => ({ category }));
        context.goods!.items      = props.partOfGoodsCategoryList
            .reduce((items, category) =>
                    items.concat(category.children.map((service) => ({
                        category: category.id.toString(),
                        item    : service.id.toString(),
                    })))
                , [] as Array<SalaryCriteriaContextItem>,
            );
    }

    return context;
};