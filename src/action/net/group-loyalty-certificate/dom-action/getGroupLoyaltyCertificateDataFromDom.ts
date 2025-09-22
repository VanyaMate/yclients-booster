import {
    GroupLoyaltyCertificateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { safeStringToUnsafe } from '@/helper/lib/dom/safeStringToUnsafe.ts';


export const getGroupLoyaltyCertificateDataFromDom = async function (dom: Document, logger?: ILogger): Promise<GroupLoyaltyCertificateData> {
    const form = dom.querySelector<HTMLFormElement>('#certificate-type-form');

    const getValueFromForm = function (form: HTMLFormElement, selector: string): string {
        const input = form.querySelector<HTMLInputElement>(selector);
        if (input) {
            return input.value;
        }

        throw new Error(`в форме отсутствует элемент "${ selector }"`);
    };

    const getCheckedFromForm = function (form: HTMLFormElement, selector: string): boolean {
        const input = form.querySelector<HTMLInputElement>(selector);
        if (input) {
            return input.checked;
        }

        throw new Error(`в форме отсутствует элемент "${ selector }"`);
    };

    const getValuesFromForm = function (form: HTMLFormElement, selector: string): Array<string> {
        return [ ...form.querySelectorAll<HTMLInputElement>(selector) ].map((input) => input.value);
    };

    if (form) {
        try {
            const image                             = getValueFromForm(form, '.online_image');
            const data: GroupLoyaltyCertificateData = {
                title                     : getValueFromForm(form, '#title-input'),
                multi                     : Number(getValueFromForm(form, 'input[type="radio"][name="multi"]:checked')),
                balance                   : Number(getValueFromForm(form, 'input[data-locator="input_nominal"]')),
                category_id               : Number(getValueFromForm(form, '#category-select')),
                item_type_id              : Number(getValueFromForm(form, '#item-type-select')),
                allowed_service_ids       : getValueFromForm(form, '#allowed_service_ids'),
                expiration_type_id        : Number(getValueFromForm(form, '#certificate-type-expiration-date')),
                expiration_date           : getValueFromForm(form, 'input[name="expiration_date"'),
                expiration_timeout        : Number(getValueFromForm(form, 'input[name="expiration_timeout"')),
                expiration_timeout_unit_id: Number(getValueFromForm(form, '#loyalty-certificate-expiration-unit-id')),
                is_allow_empty_code       : getCheckedFromForm(form, '#loyalty-certificate-allow-empty-code')
                                            ? 1 : 0,
                balance_edit_type_id      : Number(getValueFromForm(form, '#certificate-balance-edit-type-id')),
                is_online_sale_enabled    : getCheckedFromForm(form, '#is-online-sale-enabled-input')
                                            ? 1 : 0,
                online_sale_title         : getValueFromForm(form, 'input[name="online_sale_title"]'),
                online_image              : image
                                            ? await base64ImageLoad(image, logger)
                                            : '',
                online_sale_description   : safeStringToUnsafe(getValueFromForm(form, '#online-sale-description-input')),
                online_sale_price         : Number(getValueFromForm(form, '#online-sale-price-input')),
                salon_ids                 : getValuesFromForm(form, 'input[name="salon_ids[]"][checked]').join(','),
                save                      : Number(Date.now().toString().substring(0, 10)),
                partial_update            : 0,
                files                     : '',
            };

            return data;
        } catch (e: unknown) {
            throw new Error(`данные в форме имеют не правильный формат. ${ (e as Error).message }`);
        }
    }

    throw new Error('в документе отсутствует форма с данными');
};