export const startHandler = function (callback: () => void) {
    if (document.readyState !== 'loading') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            callback();
        });
    }
};