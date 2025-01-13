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
import { Select } from '@/shared/input/Select/Select.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import {
    getGoodsCategoriesDomAction,
} from '@/action/goods/list/dom-actions/getGoodsCategories.dom-action.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';


export type CreateManyGoodsCategoriesFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    }

export class CreateManyGoodsCategoriesForm extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _textarea: TextArea;
    private readonly _comment: TextInput;
    private readonly _clientId: string          = '';
    private readonly _progressBar: ProgressBar;
    private readonly _createButton: Button;
    private readonly _selectCategories: Select<string>;
    private readonly _splitter: PromiseSplitter = new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY);

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
        this._comment = new TextInput({
            type       : 'text',
            placeholder: 'Комментарий для всех (не обязателен)',
        });
        this._comment.insert(this._textarea.element, 'afterend');
        this._selectCategories = new Select({
            list        : getGoodsCategoriesDomAction().map((category) => ({
                value: category.id,
                label: category.title,
            })),
            withSearch  : true,
            defaultLabel: 'Без категории',
            defaultValue: '0',
        });
        this._selectCategories.insert(this._textarea.element, 'beforebegin');

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
        this._createButton.insert(this.element, 'beforeend');

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
            this._progressBar.reset(categories.length);
            let successProgress: number = 0;
            let errorProgress: number   = 0;
            this._createButton.setLoading(true);
            this._textarea.setDisable(true);

            const errorCategories: Array<string> = [];
            const parentCategoryId: string       = this._selectCategories.getValue();
            const comment: string                = this._comment.getValue();
            this._splitter.exec(
                categories.map((category) => ({
                        chain    : [
                            async () => {
                                this._logger.log(`категория "${ category }" создается`);
                                return createGoodsCategoryRequestAction(this._clientId, {
                                    title  : category,
                                    pid    : parentCategoryId,
                                    comment: comment,
                                });
                            },
                        ],
                        onSuccess: () => {
                            this._progressBar.setLeftProgress(++successProgress);
                        },
                        onError  : () => {
                            this._progressBar.setRightProgress(++errorProgress);
                            errorCategories.push(category);
                        },
                    }),
                ),
            )
                .finally(() => {
                    this._createButton.setLoading(false);
                    this._textarea.setDisable(false);
                    this._setCategoriesToTextarea(errorCategories);
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