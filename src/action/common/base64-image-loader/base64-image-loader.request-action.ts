import { ILogger } from '@/action/_logger/Logger.interface.ts';


export const base64ImageLoad = async function (url: string, logger?: ILogger): Promise<string> {
    logger?.log(`получение картинки "${ url }" в формате base64`);
    return new Promise((resolve, reject) => {
        const xhr   = new XMLHttpRequest();
        xhr.onload  = function () {
            logger?.success(`картинка "${ url }" получена`);
            const reader     = new FileReader();
            reader.onloadend = function () {
                logger?.success(`картинка "${ url }" преобразована в base64`);
                resolve(reader.result as string);
            };
            reader.onerror   = function (error) {
                logger?.error(`картинка "${ url }" не преобразована в base64`);
                reject(error);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = function (error: ProgressEvent) {
            logger?.error(`картинка "${ url }" в формате base64 не получена`);
            reject(error);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
};