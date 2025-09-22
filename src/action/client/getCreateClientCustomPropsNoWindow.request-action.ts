import { ILogger } from "../_logger/Logger.interface"
import { stringToDom } from "@/helper/lib/dom/stringToDom";

export const getCreateClientCustomPropsNoWindowRequestAction = async function (clientId: string, logger?: ILogger): Promise<HTMLDivElement> {
    logger?.log("попытка дополнительные [nowindow] поля в форме создания клиента");
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
                logger?.success('форма создания клиента получена');
                return root;
            }

            throw new Error("в контекте отсутствует нужный div");
        })
        .catch((error: unknown) => {
            logger?.error(`ошибка получения дополнительных [nowindow] полей в форме создания клиента. ${(error as Error).message}`);
            throw error;
        }); 
}