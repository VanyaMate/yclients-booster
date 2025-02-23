import { ILogger } from "@/action/_logger/Logger.interface.ts";
import { fetchResponseToDom } from "@/helper/action/fetchResponseToDom/fetchResponseToDom.ts";
import { LabelClientType } from "@/action/labels/client/types/labelClientType.ts";
import { rgbToHex } from "@/helper/lib/color/rgbToHex.ts";

export const getLabelsClientRequestAction = async function (
	clientId: string,
	logger?: ILogger,
): Promise<Array<LabelClientType>> {
	logger?.log(`Получение категорий клиентов для клиента "${clientId}"`);

	return fetch(`https://yclients.com/labels/client/${clientId}/`)
		.then(fetchResponseToDom)
		.then((dom: Document) => {
			const labelList = [
				...dom.querySelectorAll<HTMLDivElement>(
					`.project-list table tbody > .client-box`,
				),
			];
			return labelList
				.map((label) => {
					const linkElement = label.querySelector("a");
					const labelNameElement = label.querySelector(".label-name");
					const iconElement = label.querySelector(".fa");
					const linkDataSourceUrl = linkElement
						? linkElement.getAttribute("data-source-url")
						: null;

					if (
						linkElement &&
						labelNameElement &&
						iconElement &&
						linkDataSourceUrl
					) {
						return {
							id: linkDataSourceUrl
								.split("/")
								.slice(-1)[0],
							title: labelNameElement.textContent!.trim(),
							color: rgbToHex(linkElement.style.backgroundColor),
							icon: iconElement.className.split("fa fa-")[1],
							entity: "1",
						};
					}

					return null;
				})
				.filter((item) => item !== null);
		})
		.then((list) => {
			logger?.success(
				`Найдено ${list.length} категорий клиентов для клиента "${clientId}"`,
			);
			return list;
		})
		.catch((e) => {
			logger?.error(
				`Ошибка получения категорий клиентов для клиента "${clientId}". ${e?.message}`,
			);
			throw e;
		});
};
