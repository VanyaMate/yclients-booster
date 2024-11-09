import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    getSalaryCriteriaListRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaList/getSalaryCriteriaList.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    getSalaryCriteriaRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteria/getSalaryCriteria.request-action.ts';
import {
    SalaryCriteriaContextItem,
    SalaryCriteriaFullData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    getSettingsServiceCategoriesFullDataRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategoriesFullData/getSettingsServiceCategoriesFullData.request-action.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import css from './CopySalaryCriteriaForm.module.css';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';


export type CopySalaryCriteriaFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    }

export class CopySalaryCriteriaForm extends Component<HTMLDivElement> {
    private readonly _clientId: string        = '';
    private readonly _bearer: string          = '';
    private _promiseSplitter: PromiseSplitter = new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY);
    private _logger: Logger                   = new Logger({
        className: css.logger,
    });

    constructor (props: CopySalaryCriteriaFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;
        this.element.classList.add(css.container);

        this._logger.insert(this.element, 'afterbegin');

        const control = new Col({
            rows: [],
        });

        const copyToInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала для сравнения',
        });
        const checkButton = new Button({
            innerHTML: 'Сравнить',
            onclick  : async () => {
                const copyToId = copyToInput.getValue();

                if (copyToId) {
                    control.remove();
                    const copyFromData = await this._getCriteriaListData(this._clientId);
                    const copyToData   = await this._getCriteriaListData(copyToId);

                    console.log('Compare:', copyFromData, 'with', copyToData);
                }
            },
        });

        control.add(copyToInput);
        control.add(checkButton);
        control.insert(this.element, 'beforeend');

        console.log(this._renderSalaryCriteriaCompare);

        // input copyTo
        // get copyFrom criteria
        // get copyTo criteria
        // compare criteria
        // предоставить действия
    }

    private _renderSalaryCriteriaCompare (data: Array<SalaryCriteriaFullData>) {
        new Col({
            rows: data.map((item) =>
                new Col({
                    rows: [
                        new CheckboxWithLabel({
                            checked    : true,
                            label      : item.title,
                            labelPrefix: item.id,
                        }),
                        new Col({
                            className: css.box,
                            rows     : item.rules.map((rule, index) => {
                                    const children: Array<Component<HTMLElement>> = [];

                                    if (rule.context.services?.categories.length) {
                                        children.push(
                                            new Col({
                                                rows: rule.context.services.categories.map((category) =>
                                                    new Col({
                                                        rows: [
                                                            new CheckboxWithLabel({
                                                                checked    : true,
                                                                label      : category.title,
                                                                labelPrefix: category.categoryId,
                                                            }),
                                                            new Col({
                                                                className: css.box,
                                                                rows     : category.children.map((child) =>
                                                                    new CheckboxWithLabel({
                                                                        checked    : true,
                                                                        label      : child.title,
                                                                        labelPrefix: child.itemId,
                                                                    }),
                                                                ),
                                                            }),
                                                        ],
                                                    }),
                                                ),
                                            }),
                                        );
                                    }

                                    if (rule.context.services?.items.length) {
                                        children.push(
                                            new Col({
                                                rows: rule.context.services.items.map((item) =>
                                                    new Col({
                                                        rows: [
                                                            new CheckboxWithLabel({
                                                                checked    : true,
                                                                label      : item.categoryTitle,
                                                                labelPrefix: item.categoryId,
                                                            }),
                                                            new Col({
                                                                className: css.box,
                                                                rows     : [
                                                                    new CheckboxWithLabel({
                                                                        checked    : true,
                                                                        label      : item.title,
                                                                        labelPrefix: item.itemId,
                                                                    }),
                                                                ],
                                                            }),
                                                        ],
                                                    }),
                                                ),
                                            }),
                                        );
                                    }

                                    const ruleCol = new Col({
                                        rows: [
                                            new CheckboxWithLabel({
                                                checked    : true,
                                                label      : `Правило #${ index + 1 }`,
                                                labelPrefix: rule.id,
                                            }),
                                        ],
                                    });

                                    if (children.length) {
                                        ruleCol.add(
                                            new Col({
                                                className: css.box,
                                                rows     : children,
                                            }),
                                        );
                                    }

                                    return ruleCol;
                                },
                            ),
                        }),
                    ],
                }),
            ),
        }).insert(this.element, 'beforeend');
    }

    private async _getCriteriaListData (clientId: string): Promise<Array<SalaryCriteriaFullData>> {
        const list                                  = await getSalaryCriteriaListRequestAction(clientId, this._logger);
        let fullData: Array<SalaryCriteriaFullData> = [];
        let needGetServices: boolean                = false;
        return await this._promiseSplitter.exec(
            list.map((criteria) => {
                return {
                    chain: [
                        () => getSalaryCriteriaRequestAction(clientId, criteria.id, this._logger),
                        async (data: SalaryCriteriaFullData) => {
                            fullData.push(data);
                            needGetServices = data.rules.some((rule) => !!rule.context.services);
                        },
                    ],
                };
            }),
        )
            .then(async () => {
                if (fullData) {
                    this._logger.success('все критерии получены: Да');
                } else {
                    this._logger.error('все критерии получены: Нет');
                    this._logger.log('попробуйте еще раз');
                    throw new Error(''); //TODO
                }

                if (needGetServices) {
                    this._logger.log('нужно загрузить услуги: Да');
                }

                if (needGetServices && fullData) {
                    const services = await getSettingsServiceCategoriesFullDataRequestAction(
                        this._bearer,
                        clientId,
                        this._logger,
                    );

                    this._logger.log(`заполнение критериев клиента "${ clientId }" данными услуг`);

                    fullData.forEach((data) => data.rules.forEach((rule) => {
                        rule.context.services?.items.forEach((item) => {
                            item.title         = services.serviceMapper[item.itemId]?.title ?? '* Не найдено *';
                            item.categoryTitle = services.categoryMapper[item.categoryId]?.title ?? '* Не найдено *';
                        });

                        rule.context.services?.categories.forEach((category) => {
                            category.title = services.categoryMapper[category.categoryId]?.title ?? '* Не найдено *';

                            const categoryData = services.list.find(({ id }) => category.categoryId.toString() === id.toString());
                            if (categoryData) {
                                const children: Array<SalaryCriteriaContextItem> = categoryData.children.map((child) => ({
                                    title        : child.title,
                                    itemId       : child.id.toString(),
                                    categoryId   : category.categoryId,
                                    categoryTitle: category.title,
                                }));

                                category.children = children;
                            }
                        });
                    }));

                    this._logger.success(`все критерии клиента "${ clientId }" успешно заполнены`);
                    console.log('fullData', fullData);
                }

                return fullData;
            });
    }
}