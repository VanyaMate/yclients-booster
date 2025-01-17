import {
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';


export const getOnlyContextServiceCopyData = function (serviceData: SettingsServiceCategoryDataWithChildren, serviceIds: Array<string>): SettingsServiceCategoryDataWithChildren {
    return {
        ...serviceData,
        children: serviceData.children.filter((child) => serviceIds.includes(child.id.toString())),
    };
};