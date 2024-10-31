import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import css from './CreateCategoriesFormWidget.module.css';
import { Logger } from '@/entity/logger/Logger/Logger.ts';


export type CreateCategoriesFormWidgetProps =
    ComponentPropsOptional<HTMLFormElement>
    & {
        clientId: string;
    }


export class CreateCategoriesFormWidget extends Component<HTMLFormElement> {
    private _clientId: string;
    private _logger = new Logger({});

    constructor (props: CreateCategoriesFormWidgetProps) {
        const { clientId, ...other } = props;
        super('div', other);

        this._clientId         = clientId;
        this.element.innerHTML = `
            <div id="left">
                <textarea></textarea>
            </div>
            <div id="logs"></div>
        `;

        this.element.classList.add(css.container);

        const textarea = this.element.querySelector('textarea')!;
        new Button({
            innerHTML: 'Сохранить', onclick: () => {
                const value      = textarea.value;
                const categories = value.split(',').map((category) => category.trim());
                this.createCategories(categories).then(() => textarea.value = '');
            },
            isPrimary: true,
            fullWidth: true,
        }).insert(this.element.querySelector('#left')!, 'beforeend');

        this._logger.insert(this.element.querySelector('#logs')!, 'afterbegin');
    }

    private async createCategory (categoryName: string, tryCount = 0): Promise<void> {
        const requestFormData = new FormData();

        requestFormData.append('title', categoryName);
        requestFormData.append('pid', '0');
        requestFormData.append('article', '');
        requestFormData.append('comment', '');


        this._logger.log(`${ categoryName } сохранение..`);
        return fetch(this.getActionUrl(this._clientId), {
            method: 'POST',
            body  : requestFormData,
        })
            .then((response) => response.json())
            .then((data) => {
                if (data?.success) {
                    this._logger.success(`${ categoryName } -> Сохранена`);
                } else if (tryCount < 2) {
                    this._logger.log(`${ categoryName } не сохранено -> Дополнительная попытка`);
                    return this.createCategory(categoryName, tryCount + 1);
                } else {
                    this._logger.error(`${ categoryName } -> Не сохранено`);
                }
                return;
            })
            .catch((e) => {
                if (tryCount < 2) {
                    this._logger.log(`${ categoryName } не сохранено -> Дополнительная попытка`);
                } else {
                    this._logger.error(`${ categoryName } -> Не сохранено`);
                }
                throw e;
            });
    }

    private createCategories (categoryNames: Array<string>) {
        return Promise.all(categoryNames.map(this.createCategory.bind(this)));
    }

    private getActionUrl (id: string): string {
        return `/goods/category_save/${ id }/0/`;
    }
}