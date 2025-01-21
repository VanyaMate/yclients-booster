import { ILogger } from '@/action/_logger/Logger.interface.ts';

// https://yclients.com/group_loyalty_certificate_types/edit/1093672/0 POST
// FormData

export const createGroupLoyaltyCertificate = async function (salonId: string, createData: any, logger?: ILogger) {
    return [ salonId, createData, logger ];
};