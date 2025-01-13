import {
    GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import {
    ERROR_GOODS_CATEGORY_GETTING,
} from '@/action/goods/list/errors/goods-category.errors.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getGoodsCategoryRequestAction = async function (clientId: string, categoryId: string, logger?: ILogger): Promise<GoodsCategoryFullData> {
    logger?.log(`получение полной информации о категории товаров "${ categoryId }" клиента "${ clientId }"`);

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

                    logger?.success(`полная информация о категории "${ categoryId }" клиента "${ clientId }" получена`);

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

                throw new Error(`не получилось найти все нужные элементы формы на странице`);
            }

            throw new Error(ERROR_GOODS_CATEGORY_GETTING);
        })
        .catch((error: Error) => {
            logger?.error(`не получилось получить полную информацию о категории "${ categoryId }" клиента "${ clientId }". ${ error.message }`);
            throw error;
        });
};