export const stringToDom = function (str: string): Document {
    return new DOMParser().parseFromString(str, 'text/html');
};