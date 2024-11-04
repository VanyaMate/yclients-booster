import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CreateManyGoodsCategoriesForm.module.css';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import {
    createGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/createGoodsCategory.request-action.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategory.request-action.ts';


export type CreateManyGoodsCategoriesFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    }

export class CreateManyGoodsCategoriesForm extends Component<HTMLDivElement> {
    private readonly _MAX_REQUESTS_AT_TIME = 5;
    private readonly _MAX_REQUESTS_RETRY   = 2;
    private readonly _logger: Logger;
    private readonly _textarea: TextArea;
    private readonly _clientId: string     = '';
    private _progressBar: ProgressBar;
    private _createButton: Button;
    private _splitter: PromiseSplitter     = new PromiseSplitter(this._MAX_REQUESTS_AT_TIME, this._MAX_REQUESTS_RETRY);

    constructor (props: CreateManyGoodsCategoriesFormProps) {
        const { clientId, ...other } = props;
        super('div', other);

        this._clientId = clientId;
        this.element.classList.add(css.container);

        this._textarea = new TextArea({
            placeholder: 'Введите категории через Enter (\\n)',
            oninput    : this._onTextareaChange.bind(this),
        });
        this._textarea.insert(this.element, 'afterbegin');

        this._progressBar = new ProgressBar({
            max: 100,
        });
        this._progressBar.insert(this.element, 'afterbegin');
        this._progressBar.setLabelValue(`0 шт`);

        this._createButton = new Button({
            styleType: ButtonStyleType.PRIMARY,
            onclick  : this._createCategories.bind(this),
            fullWidth: true,
            innerHTML: 'Создать',
        });
        this._createButton.insert(this._textarea.element, 'afterend');

        this._logger = new Logger({});
        this._logger.insert(this.element, 'beforeend');
    }

    private _onTextareaChange () {
        const categories = this._getCategoriesTitle();
        this._progressBar.setLabelValue(`${ categories.length.toString() } шт`);
    }

    private _createCategories () {
        const categories = this._getCategoriesTitle();

        if (categories.length) {
            this._progressBar.remove();
            this._progressBar = new ProgressBar({
                max: categories.length,
            });
            this._progressBar.insert(this.element, 'afterbegin');
            let successProgress: number = 0;
            let errorProgress: number   = 0;
            this._createButton.setLoading(true);
            this._textarea.setDisable(true);

            this._splitter.exec(
                categories.map((category) => ({
                        chain    : [
                            async () => {
                                this._logger.log(`категория "${ category }" создается`);
                                return createGoodsCategoryRequestAction(this._clientId, {
                                    title: category,
                                })
                                    .then((categoryId: string) => {
                                        this._logger.success(`категория "${ category }" создана`);
                                        return categoryId;
                                    })
                                    .catch((e) => {
                                        this._logger.error(`категория "${ category }" не создана`);
                                        throw e;
                                    });
                            },
                            async (categoryId: string) => {
                                this._logger.log(`получение информации для категории "${ category }"`);
                                return getGoodsCategoryRequestAction(this._clientId, categoryId)
                                    .then(() => {
                                        this._logger.success(`данные для категории "${ category }" получены`);
                                    })
                                    .catch((e) => {
                                        this._logger.error(`данные для категории "${ category }" не получены`);
                                        throw e;
                                    });
                            },
                        ],
                        onSuccess: () => {
                            this._progressBar.setLeftProgress(++successProgress);
                        },
                        onError  : () => {
                            this._progressBar.setRightProgress(++errorProgress);
                        },
                        onBefore : () => {
                            this._logger.log(`работа с категорией ${ category } начата`);
                        },
                        onFinally: () => {
                            this._logger.log(`работа с категорией ${ category } закончена`);
                        },
                    }),
                ),
            )
                .finally(() => {
                    this._createButton.setLoading(false);
                    this._textarea.setDisable(false);
                    this._setCategoriesToTextarea([]); // TODO: Set error categories
                });
        }
    }

    private _getCategoriesTitle (): Array<string> {
        return this._textarea.getValue().trim().split('\n').filter(Boolean);
    }

    private _setCategoriesToTextarea (categories: Array<string>) {
        return this._textarea.setValue(categories.join('\n'));
    }
}