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
    private _logger: Logger                   = new Logger({});

    constructor (props: CopySalaryCriteriaFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;

        this._logger.insert(this.element, 'afterbegin');
        this._getCriteriaData(this._clientId);

        // get copyFrom criteria
        // input copyTo
        // get copyTo criteria
        // compare criteria
        // предоставить действия
    }

    private async _getCriteriaData (id: string) {
        const list                                  = await getSalaryCriteriaListRequestAction(id);
        let fullData: SalaryCriteriaFullData | null = null;
        let needGetServices: boolean                = false;
        this._promiseSplitter.exec(
            list.map((criteria) => {
                return {
                    chain    : [
                        () => getSalaryCriteriaRequestAction(id, criteria.id),
                        async (data: SalaryCriteriaFullData) => {
                            fullData        = data;
                            needGetServices = data.rules.some((rule) => !!rule.context.services);
                        },
                    ],
                    onBefore : () => {
                        this._logger.log(`получение данных для ${ criteria.title }`);
                    },
                    onSuccess: () => {
                        this._logger.success(`данные для ${ criteria.title } получены`);
                    },
                    onError  : () => {
                        this._logger.error(`данные для ${ criteria.title } не получены`);
                    },
                };
            }),
        )
            .then(async () => {
                if (needGetServices && fullData) {
                    const services = await getSettingsServiceCategoriesFullDataRequestAction(
                        this._bearer,
                        id,
                    );

                    console.log('services', services);

                    fullData.rules.forEach((rule) => {
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
                    });
                }
                console.log('fullData -> ', fullData);
            });
    }
}