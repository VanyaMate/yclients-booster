import { ILogger } from '@/action/_logger/Logger.interface.ts';


const getForceFormData = function (force = false) {
    const formData = new FormData();
    if (force) {
        formData.set('force', '1');
    }
    return formData;
};

export const removeTechnologicalCardRequestAction = function (clientId: string, tehCardId: string, logger?: ILogger) {
    logger?.log(`попытка удалить технологическую карту с id "${ tehCardId }"`);

    return fetch(`https://yclients.com/technological_cards/delete/${ clientId }/${ tehCardId }`, {
        method: 'POST',
        body  : getForceFormData(true),
    })
        .then((response) => {
            if (response.ok) {
                logger?.success(`технологическая карта с id "${ tehCardId }" удалена`);
            } else {
                throw response.json();
            }
        })
        .catch((error) => {
            logger?.error(`технологическая карта с id "${ tehCardId }" не удалена. ${ error.message }`);
        });
};