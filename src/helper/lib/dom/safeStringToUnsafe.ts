export const safeStringToUnsafe = function (str: string): string {
    return new DOMParser().parseFromString(str, 'text/html').documentElement.querySelector('body')!.innerHTML ?? '';
};