import { ILogger } from "../_logger/Logger.interface"
import { stringToDom } from "@/helper/lib/dom/stringToDom";
import { CustomPropData } from "./getCreateClientCustomPropsWindow.request-action";

export const getCreateClientCustomPropsNoWindowRequestAction = async function (clientId: string, logger?: ILogger): Promise<Array<CustomPropData>> {
    logger?.log("попытка получить дополнительные [nowindow] поля в форме создания клиента");
    return fetch(`https://yclients.com/custom_fields_salon/resource/tab_not_by_window/${clientId}/client/0/is_show_ui_window_client`)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }

            throw response.json();
        })
        .then((response) => {
            if (response.data) {
                if (response.data.content) {
                    return response.data.content;
                } else {
                    throw new Error("в ответе в data отсутствует content");
                }
            } else {
                throw new Error("в ответе отсутствует data");
            }
        })
        .then(stringToDom)
        .then((dom) => {
            const root = dom.querySelector<HTMLDivElement>('body > div');
            if (root) {
                logger?.log('форма создания клиента получена');
                return root;
            }

            throw new Error("в контекте отсутствует нужный div");
        })
        .then((div) => {
            const formGroup = div.querySelectorAll('.form-group');
            const customProps: Array<CustomPropData> = [...formGroup]
                .map((form) => {
                    const label = form.querySelector('label.control-label');
                    const formItem = form.querySelector<HTMLInputElement>('.form-control');

                    if (label && formItem) {
                        return {
                            label: label.textContent!,
                            name: formItem.name,
                            isCustom: true,
                        } satisfies CustomPropData;
                    } else {
                        return null;
                    }
                })
                .filter((item) => item !== null);
            
            logger?.success(`получено ${customProps.length} кастомных [mowindow] полей`);
            return customProps;
        })
        .catch((error: unknown) => {
            logger?.error(`ошибка получения дополнительных [nowindow] полей в форме создания клиента. ${(error as Error).message}`);
            throw error;
        }); 
}