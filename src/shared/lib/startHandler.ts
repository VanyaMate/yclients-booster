export const startHandler = function (callback: () => void) {
    if (document.readyState === 'complete') {
        callback();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            callback();
        });
    }
};