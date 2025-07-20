import {
    GroupLoyaltyCertificateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';


export const getGroupLoyaltyCertificateDataFromDom = function (dom: Document): GroupLoyaltyCertificateData {
    const form = dom.querySelector('#certificate-type-form');

    if (form) {
        try {
            const data: GroupLoyaltyCertificateData = {
                title                     : form.querySelector<HTMLInputElement>('#title-input')!.value,
                multi                     : Number(form.querySelector<HTMLSelectElement>('#multi-select')!.value),
                balance                   : Number(form.querySelector<HTMLInputElement>('input[data-locator="input_nominal"]')!.value),
                category_id               : Number(form.querySelector<HTMLSelectElement>('#category-select')!.value),
                item_type_id              : Number(form.querySelector<HTMLSelectElement>('#item-type-select')!.value),
                allowed_service_ids       : form.querySelector<HTMLInputElement>('#allowed_service_ids')!.value,
                expiration_type_id        : Number(form.querySelector<HTMLSelectElement>('#certificate-type-expiration-date')!.value),
                expiration_date           : form.querySelector<HTMLInputElement>('#certificate-type-expiration-timeout')!.value,
                expiration_timeout        : Number(form.querySelector<HTMLInputElement>('#certificate-type-expiration-timeout')!.value),
                expiration_timeout_unit_id: Number(form.querySelector<HTMLSelectElement>('#loyalty-certificate-expiration-unit-id')!.value),
                is_allow_empty_code       : form.querySelector<HTMLInputElement>('#loyalty-certificate-allow-empty-code')!.checked
                                            ? 1 : 0,
                balance_edit_type_id      : Number(form.querySelector<HTMLSelectElement>('#certificate-balance-edit-type-id')!.value),
                is_online_sale_enabled    : form.querySelector<HTMLInputElement>('#is-online-sale-enabled-input')!.checked
                                            ? 1 : 0,
                online_sale_title         : form.querySelector<HTMLInputElement>('input[name="online_sale_title"]')!.value,
                online_image              : form.querySelector<HTMLInputElement>('input[name="online_image"]')!.value,
                online_sale_description   : form.querySelector<HTMLDivElement>('.note-editor > .note-editing-area > .note-editable')!.innerHTML,
                online_sale_price         : Number(form.querySelector<HTMLInputElement>('#online-sale-price-input')!.value),
                salon_ids                 : [ ...form.querySelectorAll<HTMLInputElement>('input[name="salon_ids[]"][checked]') ]
                    .map((input) => input.value)
                    .join(','),
                save                      : Number(Date.now().toString().substring(0, 10)),
                partial_update            : 0,
                files                     : '',
            };

            return data;
        } catch (e) {
            throw new Error('Данные в форме имеют не правильный формат');
        }
    }

    throw new Error('В документе отсутствует форма с данными');
};