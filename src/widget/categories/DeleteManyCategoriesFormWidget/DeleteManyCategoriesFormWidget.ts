import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { RequestSplitter } from '@/service/RequestSplitter/RequestSplitter.ts';
import css from './DeleteManyCategoriesFormWidget.module.css';


export type DeleteManyCategoriesFormWidgetProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    };
export type CategoryData = {
    id: string;
    title: string;
}

export class DeleteManyCategoriesFormWidget extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _clientId: string;
    private _requestSplitter: RequestSplitter<CategoryData>;

    constructor (props: DeleteManyCategoriesFormWidgetProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);

        this._clientId = clientId;
        this._logger   = new Logger({
            className: css.right,
        });

        this._requestSplitter = new RequestSplitter<CategoryData>(
            (data: any) => data?.success ? '' : data?.meta?.message,
            (category: CategoryData) => this._logger.log(`категория "${ category.title }" удаляется...`),
            (category: CategoryData) => this._logger.success(`категория "${ category.title }" удалена.`),
            (category: CategoryData, retry: number) => this._logger.log(`категория "${ category.title }" не удалена. Попытка ${ retry }`),
            (category: CategoryData, error: unknown) => this._logger.error(`категория "${ category.title }" не удалена. Ошибка ${ error }`),
            (success, error) => {
                console.log('Success', success, 'Error', error);
            },
            5,
            1,
        );
    }

    setCategories (categories: Array<CategoryData>) {
        this.element.innerHTML = '';
        this._logger.reset();

        let selectedCategories: Array<CategoryData> = [];

        const checkboxes = categories.map((category) => {
            return new CheckboxWithLabel({
                onchange: (event) => {
                    const target = event.target as HTMLInputElement;
                    if (target.checked) {
                        selectedCategories.push(category);
                    } else {
                        selectedCategories = selectedCategories.filter(({ id }) => id !== category.id);
                    }
                },
                label   : `[${ category.id }] ${ category.title }`,
            });
        });

        const controlls1 = new Col({
            rows: [
                new Button({
                    innerHTML: 'Выделить все',
                    fullWidth: true,
                    onclick  : () => {
                        checkboxes.forEach((checkbox) => checkbox.setChecked(true));
                    },
                }),
                new Button({
                    innerHTML: 'Снять выделение',
                    fullWidth: true,
                    onclick  : () => {
                        checkboxes.forEach((checkbox) => checkbox.setChecked(false));
                    },
                }),
                new Button({
                    innerHTML: 'Удалить выделенные', fullWidth: true,
                    styleType: ButtonStyleType.DANGER,
                    onclick  : () => {
                        this._requestSplitter.requests(
                            selectedCategories.map((category) => ({
                                data   : category,
                                url    : this.getRemoveCategoryUrl(this._clientId, category.id),
                                options: { method: 'POST' },
                            })),
                        );
                        console.log('delete: ', selectedCategories);
                    },
                }),
            ],
        });

        const controlls2 = new Col({
            rows: [
                new Button({
                    innerHTML: 'Выделить все',
                    fullWidth: true,
                    onclick  : () => {
                        checkboxes.forEach((checkbox) => checkbox.setChecked(true));
                    },
                }),
                new Button({
                    innerHTML: 'Снять выделение',
                    fullWidth: true,
                    onclick  : () => {
                        checkboxes.forEach((checkbox) => checkbox.setChecked(false));
                    },
                }),
                new Button({
                    innerHTML: 'Удалить выделенные', fullWidth: true,
                    styleType: ButtonStyleType.DANGER,
                    onclick  : () => {
                        this._requestSplitter.requests(
                            selectedCategories.map((category) => ({
                                data   : category,
                                url    : this.getRemoveCategoryUrl(this._clientId, category.id),
                                options: { method: 'POST' },
                            })),
                        );
                        console.log('delete: ', selectedCategories);
                    },
                }),
            ],
        });

        const checkboxesCol = new Col({
            rows: checkboxes,
        });

        const form = new Col({
            rows     : [
                controlls1,
                checkboxesCol,
                controlls2,
            ],
            className: css.left,
        });

        form.insert(this.element, 'afterbegin');
        this._logger.insert(this.element, 'beforeend');
    }

    private getRemoveCategoryUrl (clientId: string, categoryId: string): string {
        return `https://yclients.com/goods/category_delete/${ clientId }/${ categoryId }`;
    }
}