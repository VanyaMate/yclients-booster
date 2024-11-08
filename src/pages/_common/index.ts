import { startHandler } from '@/shared/lib/startHandler.ts';
import { Component } from '@/shared/component/Component.ts';


export const getPageSizeSelect = function (): HTMLSelectElement | null {
    return document.querySelector<HTMLSelectElement>(`select[name="page_size"], select[name="editable_length"]`);
};

export const commonPageHandler = function () {
    startHandler(() => {
        /**
         * Добавление к Select editableLength нового параметра "Все"
         */
        {
            const pageSizeSelect = getPageSizeSelect();

            if (pageSizeSelect) {
                new Component<HTMLOptionElement>('option', {
                    value    : `999999`,
                    innerHTML: `Все`,
                }).insert(pageSizeSelect, 'beforeend');
            }
        }
    });
};
