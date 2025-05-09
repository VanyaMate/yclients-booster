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

export const getSalaryContextByChildren = function (props: GetSalaryCriteriaContextProps): SalaryCriteriaContext {
    const context: SalaryCriteriaContext = {};

    if (props.serviceCategoryList.length || props.partOfServiceCategoryList.length) {
        context.services = { categories: [], items: [] };

        context.services!.categories = props.serviceCategoryList.map((category) => ({
            categoryId: category.id.toString(),
        }));
        context.services!.items      = props.partOfServiceCategoryList
            .reduce(
                (items, category) =>
                    items.concat(category.children.map((service) => ({
                        categoryId: service.category_id.toString(),
                        itemId    : service.id.toString(),
                    })))
                , [] as Array<SalaryCriteriaContextItem>,
            );
    }

    if (props.partOfGoodsCategoryList && props.partOfGoodsCategoryList.length) {
        context.goods = { categories: [], items: [] };

        context.goods!.categories = props.goodsCategoryList.map((category) => ({ categoryId: category.id }));
        context.goods!.items      = props.partOfGoodsCategoryList
            .reduce((items, category) =>
                    items.concat(category.children.map((service) => ({
                        categoryId: category.id.toString(),
                        itemId    : service.id.toString(),
                    })))
                , [] as Array<SalaryCriteriaContextItem>,
            );
    }

    return context;
};