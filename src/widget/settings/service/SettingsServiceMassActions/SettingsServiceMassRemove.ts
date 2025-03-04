import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    getSettingsServiceCategoriesFullDataRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategoriesFullData/getSettingsServiceCategoriesFullData.request-action.ts';
import css from './SettingsServiceMassRemove.module.css';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Details, DetailsType } from '@/shared/box/Details/Details.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import {
    SettingsServiceCategoryResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import {
    SettingsServiceCategoryRemoveAction,
} from '@/widget/settings/service/SettingsServiceCategoryRemoveAction/SettingsServiceCategoryRemoveAction.ts';
import {
    SettingsServiceRemoveAction,
} from '@/widget/settings/service/SettingsServiceRemoveAction/SettingsServiceRemoveAction.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';


export type SettingsServiceMassRemoveProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        bearer: string;
        clientId: string;
    };

export class SettingsServiceMassRemove extends Component<HTMLDivElement> {
    private readonly _bearer: string;
    private readonly _clientId: string;
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col   = new Col({ rows: [ this._logger ] });

    /*    private readonly _categoriesToRemove: Array<string> = [];
     private readonly _servicesToRemove: Array<string>   = [];*/

    constructor (props: SettingsServiceMassRemoveProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);

        this.element.classList.add(css.container);

        this._bearer   = bearer;
        this._clientId = clientId;

        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const getAllButton = new Button({
            textContent: 'Получить список всех категорий и услуг',
            onclick    : async () => {
                getAllButton.setLoading(true);
                getAllButton.element.textContent = 'Получение..';
                this._renderList()
                    .then(() => {
                        getAllButton.remove();
                    })
                    .catch(() => {
                        getAllButton.setLoading(false);
                        getAllButton.element.textContent = 'Попробовать еще раз';
                    });
            },
        });

        this._content.add(getAllButton);
    }

    private async _renderList () {
        const categories                 = await getSettingsServiceCategoriesFullDataRequestAction(this._bearer, this._clientId, this._logger);
        let categoriesIds: Array<string> = [];
        let servicesIds: Array<string>   = [];

        const details = new Col({
            rows: categories.list.map((category) => {
                return new Details({
                    type   : DetailsType.SECOND,
                    padding: 5,
                    header : new CheckboxWithLabel({
                        label   : `[${ category.id }] ${ category.title }`,
                        onchange: (event: Event) => {
                            const target = event.target as HTMLInputElement;
                            if (target.checked) {
                                categoriesIds.push(category.id.toString());
                            } else {
                                categoriesIds = categoriesIds.filter((id) => id !== category.id.toString());
                            }
                        },
                    }),
                    details: new Col({
                        rows: category.children.map((service) => {
                            return new CheckboxWithLabel({
                                label   : `[${ service.id }] ${ service.title }`,
                                onchange: (event: Event) => {
                                    const target = event.target as HTMLInputElement;
                                    if (target.checked) {
                                        servicesIds.push(service.id.toString());
                                    } else {
                                        servicesIds = servicesIds.filter((id) => id !== service.id.toString());
                                    }
                                },
                            });
                        }),
                    }),
                });
            }),
        });

        this._content.add(details);

        const removeButton = new Button({
            textContent: 'Выбрать для удаления',
            onclick    : () => {
                details.remove();
                removeButton.remove();
                this._renderConfirmation(categories, categoriesIds, servicesIds);
            },
            styleType  : ButtonStyleType.DANGER,
        });

        this._content.add(removeButton);
    }

    private _renderConfirmation (categories: SettingsServiceCategoryResponse, categoriesToRemove: Array<string>, servicesToRemove: Array<string>) {
        const progressBar   = new ProgressBar({ max: categoriesToRemove.length + servicesToRemove.length });
        let success: number = 0;
        let errors: number  = 0;

        const categoriesTitle            = new LabelDivider({ textContent: 'Категории' });
        const categoriesActionComponents = categoriesToRemove.map((categoryId) => {
            const category = categories.list.find((category) => category.id.toString() === categoryId)!;
            return new SettingsServiceCategoryRemoveAction({
                bearer       : this._bearer,
                clientId     : this._clientId,
                logger       : this._logger,
                categoryId,
                categoryTitle: category.title,
                categoryData : category,
            });
        });
        const categoriesList             = new Col({ rows: categoriesActionComponents });
        const servicesTitle              = new LabelDivider({ textContent: 'Услуги' });
        const servicesActionComponents   = servicesToRemove.map((serviceId) => {
            return new SettingsServiceRemoveAction({
                bearer      : this._bearer,
                clientId    : this._clientId,
                logger      : this._logger,
                serviceId,
                serviceTitle: categories.serviceMapper[serviceId].title,
            });
        });
        const servicesList               = new Col({ rows: servicesActionComponents });
        const removeButton               = new Button({
            textContent: 'Подтвердить удаление',
            styleType  : ButtonStyleType.DANGER,
            onclick    : () => {
                removeButton.setLoading(true);
                removeButton.element.textContent = 'Удаление...';
                new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY)
                    .exec([
                        ...servicesActionComponents.map((component) => ({
                            chain    : [ component.getAction() ],
                            onSuccess: () => progressBar.setLeftProgress(++success),
                            onError  : () => progressBar.setRightProgress(++errors),
                        })),
                        ...categoriesActionComponents.map((component) => ({
                            chain    : [ component.getAction() ],
                            onSuccess: () => progressBar.setLeftProgress(++success),
                            onError  : () => progressBar.setRightProgress(++errors),
                        })),
                    ])
                    .then(() => {
                        removeButton.setStyleType(ButtonStyleType.DEFAULT);
                        removeButton.element.textContent = 'Обновить';
                        removeButton.element.onclick     = () => {
                            progressBar.remove();
                            categoriesTitle.remove();
                            categoriesList.remove();
                            servicesTitle.remove();
                            servicesList.remove();
                            removeButton.remove();
                            this._renderList();
                        };
                    })
                    .catch(() => removeButton.element.textContent = 'Произошла ошибка')
                    .finally(() => removeButton.setLoading(false));
            },
        });

        this._content.add(progressBar);
        this._content.add(removeButton);
        this._content.add(categoriesTitle);
        this._content.add(categoriesList);
        this._content.add(servicesTitle);
        this._content.add(servicesList);
    }
}