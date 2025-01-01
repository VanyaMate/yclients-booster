import { GoodData } from '@/action/goods/types/good.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    fetchResponseToDom,
} from '@/helper/action/fetchResponseToDom/fetchResponseToDom.ts';


export const getGoodRequestAction = async function (clientId: string, categoryId: string, goodId: string, logger?: ILogger): Promise<GoodData> {
    logger?.log(`получение информации о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }"`);

    return fetch(`https://yclients.com/goods/edit/${ clientId }/${ categoryId }/${ goodId }/`, {
        method: 'GET',
    })
        .then(fetchResponseToDom)
        .then((dom) => {
            const form = dom.querySelector('#goods_form');

            if (form) {
                const title           = form.querySelector<HTMLInputElement>('input[name="title"]')!.value;
                const print_title     = form.querySelector<HTMLInputElement>('input[name="print_title"]')!.value;
                const article         = Number(form.querySelector<HTMLInputElement>('input[name="article"]')!.value);
                const barcode         = form.querySelector<HTMLInputElement>('input[name="barcode"]')!.value;
                const category_id     = Number(form.querySelector<HTMLSelectElement>('select[name="category_id"]')!.value);
                const sale_unit_id    = Number(form.querySelector<HTMLSelectElement>('select[name="sale_unit_id"]')!.value);
                const unit_equals     = Number(form.querySelector<HTMLInputElement>('input[name="unit_equals"]')!.value);
                const service_unit_id = Number(form.querySelector<HTMLSelectElement>('select[name="service_unit_id"]')!.value);
                const netto           = Number(form.querySelector<HTMLInputElement>('input[name="netto"]')!.value);
                const brutto          = Number(form.querySelector<HTMLInputElement>('input[name="brutto"]')!.value);
                const cost            = Number(form.querySelector<HTMLInputElement>('input[name="cost"]')!.value);
                const actual_cost     = Number(form.querySelector<HTMLInputElement>('input[name="actual_cost"]')!.value);
                const tax_variant     = Number(form.querySelector<HTMLSelectElement>('select[name="tax_variant"]')!.value);
                const vat_id          = Number(form.querySelector<HTMLSelectElement>('select[name="vat_id"]')!.value);
                const critical_amount = Number(form.querySelector<HTMLInputElement>('input[name="critical_amount"]')!.value);
                const desired_amount  = Number(form.querySelector<HTMLInputElement>('input[name="desired_amount"]')!.value);
                const comment         = form.querySelector<HTMLTextAreaElement>('textarea[name="comment"]')!.value;

                logger?.success(`информация о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }" получена`);

                return {
                    id: goodId,
                    title,
                    print_title,
                    article,
                    barcode,
                    category_id,
                    sale_unit_id,
                    unit_equals,
                    service_unit_id,
                    netto,
                    brutto,
                    cost,
                    actual_cost,
                    tax_variant,
                    vat_id,
                    critical_amount,
                    desired_amount,
                    comment,
                };
            }

            throw new Error('форма не найдена');
        })
        .catch((error: Error) => {
            logger?.error(`информация о товаре "${ goodId }" категории "${ categoryId }" клиента "${ clientId }" не получена. ${ error.message }`);
            throw error;
        });
};