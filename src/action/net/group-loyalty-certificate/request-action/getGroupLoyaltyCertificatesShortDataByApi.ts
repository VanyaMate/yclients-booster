import {
    GroupLoyaltyCertificateApiResponse,
    GroupLoyaltyCertificateShortData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const getGroupLoyaltyCertificatesShortDataByApi = async function (bearer: string, clientId: string, logger?: ILogger): Promise<Array<GroupLoyaltyCertificateShortData>> {
    const result: Array<GroupLoyaltyCertificateShortData> = [];
    const limit: number                                   = 50;
    let page: number                                      = 1;
    let isFinish: boolean                                 = false;

    logger?.log(`попытка получить список всех не архивированных сертификатов клиента "${ clientId }"`);

    while (!isFinish) {
        logger?.log(`получение списка из "${ limit }" не архивированных сертификатов клиента "${ clientId }" страницы "${ page }"`);
        await fetch(`https://yclients.com/api/v1/chain/${ clientId }/loyalty/certificate_types/?page=${ page }&limit=${ limit }&category_id=0&is_archived=false`, {
            method : 'GET',
            headers: {
                'Authorization': `Bearer ${ bearer }`,
                'Content-Type' : 'application/json',
            },
        })
            .then(async (response) => {
                if (response.ok) {
                    return response.json();
                }

                throw new Error(`ошибка запроса. код: ${ response.status }. текст: ${ await response.text() }`);
            })
            .then((response: GroupLoyaltyCertificateApiResponse) => {
                logger?.success(`список из "${ limit }" не архивированных сертификатов клиента "${ clientId }" страницы "${ page }" получен`);

                result.push(...response.data.map((certificate) => ({
                    id: certificate.id.toString(), title: certificate.title,
                })));

                if (response.data.length === limit) {
                    page += 1;
                } else {
                    isFinish = true;
                }
            })
            .catch((error) => {
                logger?.error(`"список не архивированных сертификатов клиента "${ clientId }" не получен. ${ error.message }`);
                throw error;
            });
    }

    logger?.success(`все не архивированные сертификаты клиента "${ clientId }" получены`);

    return result;
};