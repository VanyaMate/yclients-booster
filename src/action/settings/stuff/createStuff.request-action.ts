/**
 * post: https://yclients.com/api/v1/company/1092329/staff/quick
 *
 * {"name":"Vanya","specialization":"Dev","position_id":null,"user_phone":null,"user_email":null,"is_user_invite":false,"user_role":"worker","is_fired":true,"include":["user.invite","user.user_slug","user.is_approved_salon","user.user_type","user.free_reason","user.is_paid","is_paid","free_reason"]}
 *
 */
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Fetch } from '@/service/Fetcher/implementations/Fetch.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


export type CreateStuffRequestActionData = {
    name: string;
    specialization: string;
    fired: boolean;
}

export const createStuffRequestAction = async function (bearer: string, clientId: string, data: CreateStuffRequestActionData, fetcher: IFetcher = new Fetch(), logger?: ILogger): Promise<any> {
    logger?.log(`попытка создать сотрудника "${ data.name }" для "${ clientId }"`);
    fetcher.fetch(`https://yclients.com/api/v1/company/${ clientId }/staff/quick`, {
        method : 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': `Bearer ${ bearer }`,
        },
        body   : JSON.stringify({
            name          : data.name,
            specialization: data.specialization,
            is_fired      : data.fired,
            //
            is_user_invite: false,
            position_id   : null,
            user_email    : null,
            user_phone    : null,
            user_role     : 'worker',
            include       : [
                'user.invite',
                'user.user_slug',
                'user.is_approved_salon',
                'user.user_type',
                'user.free_reason',
                'user.is_paid',
                'is_paid',
                'free_reason',
            ],
        }),
    })
        .then(async (response) => {
            if (response.ok) {
                logger?.success(`сотрудник "${ data.name }" для клиента "${ clientId }" успешно создан`);
                return response.json();
            } else {
                throw new Error(await response.json());
            }
        })
        .catch((error) => {
            logger?.error(`ошибка создания сотрудника "${ data.name }" клиента "${ clientId }". ${ error.message }`);
        });
};