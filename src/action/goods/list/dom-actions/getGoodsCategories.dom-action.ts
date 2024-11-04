export const getGoodsCategoriesDomAction = function () {
    const categories = [ ...document.querySelectorAll('.dd-item') ];
    return categories.map((category) => ({
        id   : category.getAttribute('data-id') ?? '-',
        title: category.textContent!.trim(),
    }));
};