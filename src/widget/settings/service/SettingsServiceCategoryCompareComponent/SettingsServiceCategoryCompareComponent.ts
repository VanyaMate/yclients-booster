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
    CompareType, ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
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
} from '@/widget/header-types.ts';
import {
    CompareBoxWithoutValidation,
} from '@/entity/compare/CompareWithoutValidation/CompareBoxWithoutValidation.ts';
import {
    SettingsServiceDropdownActions,
} from '@/widget/settings/service/SettingsServiceDropdownActions/SettingsServiceDropdownActions.ts';
import {
    ResourceDropdownActions,
} from '@/widget/resources/ResourceDropdownActions/ResourceDropdownActions.ts';
import {
    ResourceInstanceDropdownActions,
} from '@/widget/resources/ResourceInstanceDropdownActions/ResourceInstanceDropdownActions.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    CompareTranslationsValue,
} from '@/entity/compare/CompareValue/CompareTranslationsValue/CompareTranslationsValue.ts';
import { LanguageMapper } from '@/mapper/LanguageMapper.ts';


export type SettingsServiceCategoryCompareComponentProps =
    CompareComponentProps
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

export class SettingsServiceCategoryCompareComponent extends CompareComponent<SettingsServiceCategoryDataWithChildren> {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetResources: Array<Resource>;
    private readonly _targetCategory: SettingsServiceCategoryDataWithChildren;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _serviceComponents: Array<ICompareEntity<SettingsServiceData>> = [];
    private _clientCategory?: SettingsServiceCategoryDataWithChildren;

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

        this._render();
    }

    public getChildren (): Array<ICompareEntity<SettingsServiceData>> {
        return this._serviceComponents;
    }

    protected async _action () {
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
                    const updatedData = await updateSettingsServiceCategoryByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientCategory.id.toString(),
                        this._clientCategory,
                        this._targetCategory,
                        this._fetcher,
                        this._logger,
                    );

                    return {
                        ...this._clientCategory,
                        ...updatedData,
                    };
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
                    const updateData = await updateSettingsServiceCategoryByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientCategory.id.toString(),
                        this._clientCategory,
                        this._targetCategory,
                        this._fetcher,
                        this._logger,
                    );

                    // return item
                    return {
                        ...this._clientCategory,
                        ...updateData,
                    };
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
        this._beforeRender();

        this._compareChildren = [
            new CompareBoxWithoutValidation({
                title     : 'Массовые действия',
                level     : 3,
                components: [
                    new Row({
                        cols: [
                            new SettingsServiceDropdownActions({ compareEntity: this }),
                            new ResourceDropdownActions({ compareEntity: this }),
                            new ResourceInstanceDropdownActions({ compareEntity: this }),
                        ],
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Услуги',
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
                        parent            : this,
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
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetCategory.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.id,
                        }),
                        validate   : false,
                        parent     : this,
                    }),
                    new CompareRow({
                        label      : 'Сетевая категория',
                        targetValue: new CompareTextValue({
                            value: this._targetCategory.id,
                            label: Converter.yesOrNo(this._targetCategory?.is_chain),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCategory?.id,
                            label: Converter.yesOrNo(this._clientCategory?.is_chain),
                        }),
                        validate   : false,
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Название для онлайн записи',
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
                        disable    : this._clientCategory?.is_chain,
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Языки',
                level     : 2,
                open      : false,
                components: [
                    new CompareRow({
                        label           : 'Языки',
                        targetValue     : new CompareTranslationsValue({
                            list    : this._targetCategory.translations.map((translation) => ({
                                id   : translation.language_id.toString(),
                                value: translation.translation,
                            })),
                            mapper  : LanguageMapper,
                            onChange: (item) => {
                                for (let i = 0; i < this._targetCategory.translations.length; i++) {
                                    if (this._targetCategory.translations[i].language_id.toString() === item.id) {
                                        this._targetCategory.translations[i].translation = item.value;
                                        break;
                                    }
                                }
                            },
                        }),
                        clientValue     : new CompareTranslationsValue({
                            list             : this._clientCategory?.translations.map((translation) => ({
                                id   : translation.language_id.toString(),
                                value: translation.translation,
                            })),
                            mapper           : LanguageMapper,
                            showAddMoreButton: false,
                            disable          : true,
                        }),
                        parent          : this,
                        alignTop        : true,
                        validationMethod: (targetValue, clientValue) => {
                            if (targetValue && clientValue) {
                                if (targetValue.length === clientValue.length) {
                                    return targetValue.every(
                                        (targetItem, index) => targetItem.id === clientValue[index].id && targetItem.value === clientValue[index].value,
                                    );
                                }

                                return false;
                            }

                            return targetValue === clientValue;
                        },
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
            onVariantChange       : (e: SelectOption<string>) => {
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
            parent                : this,
            compareType           : this._compareType,
        });

        this._beforeEndRender(this._clientCategory);
    }
}