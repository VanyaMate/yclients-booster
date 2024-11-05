import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './DeleteManyGoodsCategoriesForm.module.css';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import {
    getGoodsCategoriesDomAction,
} from '@/action/goods/list/dom-actions/getGoodsCategories.dom-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    deleteGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/deleteGoodsCategory.request-action.ts';


export type DeleteManyGoodsCategoriesFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    }

export class DeleteManyGoodsCategoriesForm extends Component<HTMLDivElement> {
    private readonly _clientId: string = '';
    private readonly _progressBar: ProgressBar;
    private readonly _logger: Logger;
    private readonly _promiseSplitter: PromiseSplitter;

    constructor (props: DeleteManyGoodsCategoriesFormProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);

        this._clientId        = clientId;
        this._promiseSplitter = new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY);
        this._logger          = new Logger({ className: css.logger });
        this._progressBar     = new ProgressBar({ max: 0 });

        const checkboxes = getGoodsCategoriesDomAction().map((category) => {
            return new CheckboxWithLabel({
                label      : category.title,
                labelPrefix: category.id,
                value      : category.id,
            });
        });

        const search            = new TextInput({
            type       : 'text',
            placeholder: 'Поиск по категориям',
        });
        const selectAllButton   = new Button({
            textContent: 'Выделить все',
            onclick    : () => checkboxes.forEach((checkbox) => checkbox.setChecked(true)),
        });
        const unselectAllButton = new Button({
            textContent: 'Снять выделение',
            onclick    : () => checkboxes.forEach((checkbox) => checkbox.setChecked(false)),
        });

        const removeAllSelectedButton = new Button({
            textContent: 'Удалить выделенные',
            styleType  : ButtonStyleType.DANGER,
            onclick    : () => {
                let successRemoved: number = 0;
                let errorRemoved: number   = 0;
                search.setDisable(true);
                selectAllButton.setLoading(true);
                unselectAllButton.setLoading(true);
                removeAllSelectedButton.setLoading(true);

                const checked = checkboxes.filter((checkbox) => checkbox.getState());
                this._progressBar.reset(checked.length);

                this._promiseSplitter.exec(
                    checked.map(
                        (checkbox) => {
                            return {
                                chain    : [
                                    async () => deleteGoodsCategoryRequestAction(this._clientId, checkbox.getValue()),
                                ],
                                onBefore : () => {
                                    this._logger.log(`удаление категории "${ checkbox.getLabel() }"`);
                                },
                                onSuccess: () => {
                                    this._logger.success(`категория "${ checkbox.getLabel() }" удалена`);
                                    this._progressBar.setLeftProgress(++successRemoved);
                                    checkbox.setChecked(false);
                                    checkbox.setDisable(true);
                                },
                                onError  : () => {
                                    this._logger.error(`категория "${ checkbox.getLabel() }" не удалена`);
                                    this._progressBar.setRightProgress(++errorRemoved);
                                },
                            };
                        },
                    ),
                )
                    .finally(() => {
                        search.setDisable(false);
                        selectAllButton.setLoading(false);
                        unselectAllButton.setLoading(false);
                        removeAllSelectedButton.setLoading(false);
                    });
            },
        });

        const control = new Col({
            rows: [
                selectAllButton,
                unselectAllButton,
                removeAllSelectedButton,
            ],
        });

        const categories = new Col({
            rows: checkboxes,
        });

        const center = new Col({
            rows: [
                categories,
            ],
        });
        const footer = new Col({
            rows     : [
                control,
                this._progressBar,
                this._logger,
            ],
            className: css.footer,
        });


        center.insert(this.element, 'afterbegin');
        footer.insert(this.element, 'beforeend');
    }
}