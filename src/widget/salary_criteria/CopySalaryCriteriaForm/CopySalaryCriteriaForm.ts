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


        this._getCriteriaListData(this._clientId)
            .then(this._renderSalaryCriteriaCompare.bind(this));


        // get copyFrom criteria
        // input copyTo
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

    private async _getCriteriaListData (id: string): Promise<Array<SalaryCriteriaFullData>> {
        this._logger.log(`получение списка критериев для клиента "${ id }"`);
        const list                                  = await getSalaryCriteriaListRequestAction(id)
            .then((data) => {
                this._logger.success(`список критериев для клиента "${ id }" получен`);
                return data;
            })
            .catch((e) => {
                this._logger.error(`список критериев для клиента "${ id }" не получен`);
                throw e;
            });
        let fullData: Array<SalaryCriteriaFullData> = [];
        let needGetServices: boolean                = false;
        return await this._promiseSplitter.exec(
            list.map((criteria) => {
                return {
                    chain    : [
                        () => getSalaryCriteriaRequestAction(id, criteria.id),
                        async (data: SalaryCriteriaFullData) => {
                            fullData.push(data);
                            needGetServices = data.rules.some((rule) => !!rule.context.services);
                        },
                    ],
                    onBefore : () => {
                        this._logger.log(`получение данных для критерия "${ criteria.title }"`);
                    },
                    onSuccess: () => {
                        this._logger.success(`данные для критерия "${ criteria.title }" получены`);
                    },
                    onError  : () => {
                        this._logger.error(`данные для критерия "${ criteria.title }" не получены`);
                    },
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
                    this._logger.success(`нужно загрузить услуги: Да`);
                } else {
                    this._logger.log(`нужно загрузить услуги: Нет`);
                }


                if (needGetServices && fullData) {
                    this._logger.log('загрузка услуг');
                    const services = await getSettingsServiceCategoriesFullDataRequestAction(
                        this._bearer,
                        id,
                    )
                        .then((services) => {
                            this._logger.success('услуги загружены');
                            return services;
                        })
                        .catch((e) => {
                            this._logger.error('услуги не загружены');
                            throw e;
                        });

                    this._logger.log('заполнение критериев данными услуг');

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

                    this._logger.success('все критерии успешно заполнены');
                    console.log('fullData', fullData);
                }

                return fullData;
            });
    }
}