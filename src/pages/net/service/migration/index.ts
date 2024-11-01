import { startHandler } from '@/shared/lib/startHandler.ts';
import {
    SelectAllParentCategoriesButton,
} from '@/widget/net/service/migration/SelectAllParentCategoriesButton/SelectAllParentCategoriesButton.ts';
import {
    UnselectAllParentCategoriesButton,
} from '@/widget/net/service/migration/UnselectAllParentCategoriesButton/UnselectAllParentCategoriesButton.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    SelectAllChildCategoriesButton,
} from '@/widget/net/service/migration/SelectAllChildCategoriesButton/SelectAllChildCategoriesButton.ts';
import {
    UnselectAllChildCategoriesButton,
} from '@/widget/net/service/migration/UnselectAllChildCategoriesButton/UnselectAllChildCategoriesButton.ts';


export const isNetServiceMigrationPage = function (pathnameParts: Array<string>) {
    return pathnameParts[1] === 'group_services_attachment';
};

export const netServiceMigrationPageHandler = function () {
    startHandler(() => {
        const container: HTMLTableElement | null = document.querySelector('#salon_group_services_container');
        if (container) {
            new Row({
                cols: [
                    new SelectAllParentCategoriesButton(container),
                    new UnselectAllParentCategoriesButton(container),
                ],
            }).insert(container, 'beforebegin');

            container.querySelectorAll<HTMLElement>(`tbody tr:not(.service-row)`).forEach((category) => {
                const id = category.getAttribute('data-category-id') ?? '';
                console.log(category.textContent, category.querySelector('td'));
                new Row({
                    cols  : [
                        new SelectAllChildCategoriesButton(container, id),
                        new UnselectAllChildCategoriesButton(container, id),
                    ],
                    inline: true,
                })
                    .insert(category.querySelector('td')!, 'beforeend');
            });

        }
        // add select children categories button for each parent category
    });
};