import { startHandler } from '@/shared/lib/startHandler.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    mutateDom, mutation, rule,
    url,
} from '@/widget/online_booking/lib/online-booking.lib.ts';


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
            () => {
                const codeEditor = document.querySelector('.v-code-editor.online-booking-form-settings-injections-tab__code:not([data-button-injected="true"])');
                if (codeEditor) {
                    const editorContent = codeEditor.querySelector('.cm-content');
                    if (editorContent) {
                        const editorHasScripts    = hasInjectedScriptTags(editorContent.textContent ?? '');
                        const injectScriptsButton = new Button({
                            textContent: 'Добавить необходимые скрипты',
                            onclick    : () => {
                                navigator.clipboard.writeText(`<script>

/* __INJECTED_YCLIENTS_BOOSTER__ */
/* ______DO_NOT_DELETE_THIS_____ */
var url = ${ url.toString() }
var rule = ${ rule.toString() }
var mutation = ${ mutation.toString() }
var mutateDom = ${ mutateDom.toString() }
/* _______WRITE_RULES_HERE______ */

/* ______DO_NOT_DELETE_THIS_____ */

</script>`);
                            },
                            disabled   : editorHasScripts,
                            styleType  : editorHasScripts
                                         ? ButtonStyleType.DEFAULT
                                         : ButtonStyleType.PRIMARY,
                        });
                        injectScriptsButton.insert(codeEditor, 'beforebegin');
                        codeEditor.setAttribute('data-button-injected', 'true');
                    }
                }
            },
        ]);
    });
};

const hasInjectedScriptTags = function (value: string): boolean {
    return !!value.match(/__INJECTED_YCLIENTS_BOOSTER__/);
};