import { ComponentPropsOptional } from '@/shared/component/Component.ts';
import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData, SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceItemCompareComponent,
} from '@/widget/settings/service/SettingsServiceItemCompareComponent/SettingsServiceItemCompareComponent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { SelectOption } from '@/shared/input/Select/Select.ts';
import {
    CompareType,
    ICompareComponent,
} from '@/entity/compare/Compare.types.ts';
import {
    CompareComponent,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    Resource,
} from '@/action/resources/types/resources.types.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    updateSettingsServiceCategoryByTargetRequestAction,
} from '@/action/settings/service_categories/request-action/updateSettingsServiceCategoryByTarget/updateSettingsServiceCategoryByTarget.request-action.ts';
import {
    createSettingsServiceCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceCategory/createSettingsServiceCategory.request-action.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    SETTINGS_SERVICE_CATEGORY_HEADER_TYPE,
} from '@/widget/settings/service/settingsServiceHeaderTypes.ts';


export type SettingsServiceCategoryCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        // Сохранить / Обновить для этого пользователя
        clientId: string;
        // Текущие данные пользователя
        clientData: SettingsServiceCopyData;
        // Ресурсы таргета
        targetResources: Array<Resource>;
        // Сравниваемая категория
        targetCategory: SettingsServiceCategoryDataWithChildren;
        // Bearer token для запроса
        bearer: string;
        // IFetcher для запросов
        fetcher?: IFetcher;
        // ILogger для логирования
        logger?: ILogger;
    };

export class SettingsServiceCategoryCompareComponent extends CompareComponent<SettingsServiceCategoryDataWithChildren> implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetResources: Array<Resource>;
    private readonly _targetCategory: SettingsServiceCategoryDataWithChildren;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _serviceComponents: Array<SettingsServiceItemCompareComponent> = [];
    private _clientCategory?: SettingsServiceCategoryDataWithChildren;
    private _revalidateTrigger: boolean                                    = false;

    constructor (props: SettingsServiceCategoryCompareComponentProps) {
        const {
                  targetCategory,
                  clientData,
                  targetResources,
                  clientId,
                  bearer,
                  fetcher,
                  logger,
                  ...other
              } = props;
        super(other);

        this._clientId        = clientId;
        this._clientData      = clientData;
        this._targetResources = targetResources;
        this._targetCategory  = { ...targetCategory };
        this._bearer          = bearer;
        this._fetcher         = fetcher;
        this._logger          = logger;
        this._clientCategory  = this._clientData.tree.find((category) => category.title === this._targetCategory.title);

        this.element.addEventListener(CompareEvent.type, () => {
            if (!this._revalidateTrigger) {
                this._revalidateTrigger = true;
                setTimeout(() => {
                    this._revalidate(this._clientCategory);
                    this._revalidateTrigger = false;
                });
            }
        });
        this._render();
    }

    protected async _action (): Promise<SettingsServiceCategoryDataWithChildren | null> {
        if (this._clientCategory) {
            const clientCategoryId = this._clientCategory.id;
            if (this._itemIsValid()) {
                if (this._childrenIsValid()) {
                    // return item
                    return this._clientCategory;
                } else {
                    // action children
                    const services = await new PromiseSplitter(1, 3)
                        .exec<SettingsServiceData | null>(
                            this._serviceComponents.map(
                                (service) => ({
                                    chain: [ service.getAction(clientCategoryId) ],
                                }),
                            ),
                        );

                    this._clientCategory.children = services.filter((service) => !!service);
                    return this._clientCategory;
                    // return item
                }
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    return await updateSettingsServiceCategoryByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientCategory.id.toString(),
                        this._clientCategory,
                        this._targetCategory,
                        this._fetcher,
                        this._logger,
                    ) as SettingsServiceCategoryDataWithChildren;
                    // return item
                } else {
                    // action children
                    const services = await new PromiseSplitter(1, 3)
                        .exec<SettingsServiceData | null>(
                            this._serviceComponents.map(
                                (service) => ({
                                    chain: [ service.getAction(clientCategoryId) ],
                                }),
                            ),
                        );

                    this._clientCategory.children = services.filter((service) => !!service);

                    // update item
                    return await updateSettingsServiceCategoryByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientCategory.id.toString(),
                        this._clientCategory,
                        this._targetCategory,
                        this._fetcher,
                        this._logger,
                    ) as SettingsServiceCategoryDataWithChildren;
                    // return item
                }
            }
        } else {
            if (!this._isNoCreateNew()) {
                // create item
                const category: SettingsServiceCategoryDataWithChildren =
                          {
                              ...await createSettingsServiceCategoryRequestAction(
                                  this._bearer,
                                  this._clientId,
                                  {
                                      title        : this._targetCategory.title,
                                      services     : [],
                                      booking_title: this._targetCategory.booking_title ?? this._targetCategory.title,
                                      service_count: 0,
                                      api_id       : '0',
                                      staff        : [],
                                      translations : this._targetCategory.translations,
                                  },
                                  this._fetcher,
                                  this._logger,
                              ),
                              children: [],
                          };

                if (!this._childrenIsValid()) {
                    // action children
                    const services = await new PromiseSplitter(1, 3)
                        .exec<SettingsServiceData | null>(
                            this._serviceComponents.map(
                                (service) => ({
                                    chain: [ service.getAction(category.id) ],
                                }),
                            ),
                        );

                    category.children = services.filter((service) => !!service);
                }

                // return item
                return category;
            }
        }

        return null;
    }

    protected _render () {
        this.element.innerHTML = ``;
        this._compareChildren  = [
            new CompareBox({
                title     : 'Сервисы',
                level     : 3,
                components: this._serviceComponents = this._targetCategory.children.map((service) => (
                    new SettingsServiceItemCompareComponent({
                        clientId          : this._clientId,
                        targetService     : service,
                        clientServices    : this._clientCategory?.children,
                        bearer            : this._bearer,
                        fetcher           : this._fetcher,
                        logger            : this._logger,
                        targetResourceList: this._targetResources,
                        clientResourceList: this._clientData.resources,
                    })
                )),
            }),
        ];

        this._compareRows = [
            new CompareBox({
                title     : 'Информация',
                level     : 2,
                components: [
                    new CompareRow({
                        targetValue: new CompareTextValue({
                            value: this._targetCategory.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.id,
                        }),
                        label      : 'Id',
                        validate   : false,
                    }),
                    new CompareRow({
                        targetValue: new CompareTextValue({
                            value: this._targetCategory.id,
                            label: Converter.Settings.Service.yesOrNo(this._targetCategory?.is_chain),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.id,
                            label: Converter.Settings.Service.yesOrNo(this._clientCategory?.is_chain),
                        }),
                        label      : 'Сетевая категория',
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 2,
                components: [
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            value      : this._targetCategory.booking_title,
                            type       : 'text',
                            placeholder: 'Пусто',
                            onInput    : (title) => {
                                this._targetCategory.booking_title = title;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.booking_title,
                        }),
                        label      : 'Название для онлайн записи',
                        disable    : this._clientCategory?.is_chain,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            targetHeaderData      : this._targetCategory.title,
            clientHeaderData      : this._clientCategory?.title,
            label                 : 'Категория',
            variants              : this._clientData.tree
                .map((category) => ({
                    label   : category.title,
                    value   : category.id.toString(),
                    selected: category.id === this._clientCategory?.id,
                })),
            rows                  : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            onVariantChange       : (e: SelectOption) => {
                this._clientCategory = this._clientData.tree.find((category) => category.id.toString() === e.value);
                this._render();
            },
            onRename              : (title: string) => {
                this._targetCategory.title = title;
            },
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
            disable               : this._clientCategory?.is_chain,
            type                  : SETTINGS_SERVICE_CATEGORY_HEADER_TYPE,
        });

        this._revalidate(this._clientCategory);
        this._header.insert(this.element, 'beforeend');
    }
}