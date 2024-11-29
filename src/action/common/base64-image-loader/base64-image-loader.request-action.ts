export const base64ImageLoad = async function (url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const xhr   = new XMLHttpRequest();
        xhr.onload  = function () {
            const reader     = new FileReader();
            reader.onloadend = function () {
                resolve(reader.result as string);
            };
            reader.readAsDataURL(xhr.response);
        };
        xhr.onerror = reject;
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
    });
};