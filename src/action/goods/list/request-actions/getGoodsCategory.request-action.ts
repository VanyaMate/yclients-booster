import {
    GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import {
    ERROR_GOODS_CATEGORY_GETTING,
} from '@/action/goods/list/errors/goods-category.errors.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const getGoodsCategoryRequestAction = function (clientId: string, categoryId: string): Promise<GoodsCategoryFullData> {
    return fetch(`https://yclients.com/goods/category_edit/${ clientId }/${ categoryId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom: Document) => {
            const form = dom.querySelector('#goods_form');

            if (form) {
                const titleElement   = form.querySelector<HTMLInputElement>('input[name="title"]');
                const pidElement     = form.querySelector<HTMLSelectElement>('select[name="pid"], input[name="pid"]');
                const articleElement = form.querySelector<HTMLInputElement>('input[name="article"]');
                const commentElement = form.querySelector<HTMLInputElement>('input[name="comment"]');

                if (titleElement && pidElement && articleElement && commentElement) {
                    const option = pidElement.querySelector<HTMLOptionElement>(`option[value="${ pidElement.value }"]`);

                    return {
                        id             : categoryId,
                        isChainCategory: titleElement.disabled,
                        title          : titleElement.value,
                        article        : articleElement.value,
                        comment        : commentElement.value,
                        parent         : {
                            id   : pidElement.value,
                            title: option?.textContent!.trim() ?? '',
                        },
                    };
                }
            }

            throw new Error(ERROR_GOODS_CATEGORY_GETTING);
        });
};