export const fetchResponseToDom = async function (request: Response): Promise<Document> {
    return request
        .text()
        .then((text: string) => {
            const domParser = new DOMParser();
            return domParser.parseFromString(text, 'text/html');
        });
};