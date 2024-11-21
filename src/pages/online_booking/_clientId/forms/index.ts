import { startHandler } from '@/shared/lib/startHandler.ts';


export const isOnlineBookingForm = function (pathname: Array<string>): boolean {
    return pathname[1] === 'online_booking' && !!pathname[2].match(/\d/) && pathname[3] === 'forms' && !!pathname[4].match(/\d/);
};

const onUpdateRoot = function (rootSelector: string, callbacks: Array<() => void>) {
    const target = document.querySelector(rootSelector);
    if (target) {
        const observer = new MutationObserver(() => {
            observer.disconnect();
            callbacks.forEach((callback) => callback());
            observer.observe(target, { subtree: true, childList: true });
        });
        observer.observe(target, { subtree: true, childList: true });
    }
};

export const onlineBookingFormPageHandler = function () {
    startHandler(() => {
        onUpdateRoot('#online-booking-wrapper', [
            () => {
                const link = document.querySelector('.online-booking-form-settings-main-tab .online-booking-preview-actions__link:not([data-link-once="true"])');
                if (link) {
                    link.addEventListener('click', (e) => e.preventDefault());
                    link.setAttribute('data-link-once', 'true');
                }
            },
        ]);
    });
};