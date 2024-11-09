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
                    value    : `1000`,
                    innerHTML: `1000`,
                }).insert(pageSizeSelect, 'beforeend');
                new Component<HTMLOptionElement>('option', {
                    value    : `2000`,
                    innerHTML: `2000`,
                }).insert(pageSizeSelect, 'beforeend');
                new Component<HTMLOptionElement>('option', {
                    value    : `5000`,
                    innerHTML: `5000`,
                }).insert(pageSizeSelect, 'beforeend');
                new Component<HTMLOptionElement>('option', {
                    value    : `999999`,
                    innerHTML: `Все`,
                }).insert(pageSizeSelect, 'beforeend');
            }
        }
    });
};
