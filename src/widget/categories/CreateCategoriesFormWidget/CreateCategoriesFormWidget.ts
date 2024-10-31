import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import css from './CreateCategoriesFormWidget.module.css';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import {
    RequestData,
    RequestSplitter,
} from '@/service/RequestSplitter/RequestSplitter.ts';


export type CreateCategoriesFormWidgetProps =
    ComponentPropsOptional<HTMLFormElement>
    & {
        clientId: string;
    }


export class CreateCategoriesFormWidget extends Component<HTMLFormElement> {
    private _clientId: string;
    private _logger = new Logger({});
    private _requestSplitter: RequestSplitter<string>;

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

        const button = new Button({
            innerHTML: 'Создать', onclick: () => {
                button.setLoading(true);
                const value      = textarea.value;
                const categories = value.split('\n').map((category) => category.trim()).filter(Boolean);
                this.createCategories(categories);
            },
            styleType: ButtonStyleType.PRIMARY,
            fullWidth: true,
        });

        this._requestSplitter = new RequestSplitter<string>(
            (data: any) => data?.success ? '' : data?.meta?.message,
            (categoryName: string) => this._logger.log(`категория "${ categoryName }" создается...`),
            (categoryName: string) => this._logger.success(`категория "${ categoryName }" создана.`),
            (categoryName: string, retry: number) => this._logger.log(`категория "${ categoryName }" не создана. Попытка ${ retry }`),
            (categoryName: string, error: unknown) => this._logger.error(`категория "${ categoryName }" не создана. Ошибка ${ error }`),
            (success, error) => {
                console.log('Success', success, 'Error', error);
                textarea.value = error.join('\n');
                button.setLoading(false);
            },
            5,
            1,
        );

        button.insert(this.element.querySelector('#left')!, 'beforeend');

        this._logger.insert(this.element.querySelector('#logs')!, 'afterbegin');
    }

    private createCategoryRequestData (categoryName: string): RequestData<string> {
        const requestFormData = new FormData();

        requestFormData.append('title', categoryName);
        requestFormData.append('pid', '0');
        requestFormData.append('article', '');
        requestFormData.append('comment', '');

        return {
            data   : categoryName,
            url    : this.getActionUrl(this._clientId),
            options: {
                method: 'POST',
                body  : requestFormData,
            },
        };
    }

    private createCategories (categoryNames: Array<string>) {
        this._requestSplitter.requests(
            categoryNames.map((categoryName) => this.createCategoryRequestData(categoryName)),
        );
    }

    private getActionUrl (id: string): string {
        return `/goods/category_save/${ id }/0/`;
    }
}