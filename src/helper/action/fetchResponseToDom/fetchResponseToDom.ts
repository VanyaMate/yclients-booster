import { stringToDom } from '@/helper/lib/dom/stringToDom.ts';


export const fetchResponseToDom = async function (response: Response): Promise<Document> {
    return response
        .text()
        .then(stringToDom);
};