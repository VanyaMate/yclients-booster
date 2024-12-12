export const fetchResponseToDom = async function (response: Response): Promise<Document> {
    return response
        .text()
        .then((text: string) => {
            const domParser = new DOMParser();
            return domParser.parseFromString(text, 'text/html');
        });
};