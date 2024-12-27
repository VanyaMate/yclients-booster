import {
    CompareType,
    ICompareComponent, ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
import { ComponentPropsOptional } from '@/shared/component/Component.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    CompareComponent,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    CompareToggleValue,
} from '@/entity/compare/CompareValue/CompareToggleValue/CompareToggleValue.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import {
    CompareImageValue,
} from '@/entity/compare/CompareValue/CompareImageValue/CompareImageValue.ts';
import {
    CompareTimeSelectsValue,
} from '@/entity/compare/CompareValue/CompareTimeSelectsValue/CompareTimeSelectsValue.ts';
import {
    ComparePriceSelectType,
    ComparePriceWithSelectValue,
} from '@/entity/compare/CompareValue/ComparePriceWithSelectValue/ComparePriceWithSelectValue.ts';
import { SelectVariantType } from '@/shared/input/Select/Select.ts';
import {
    CompareDateValue,
} from '@/entity/compare/CompareValue/CompareDateValue/CompareDateValue.ts';
import {
    CompareTimeRangeValue,
} from '@/entity/compare/CompareValue/CompareTimeRangeValue/CompareTimeRangeValue.ts';
import {
    Resource,
} from '@/action/resources/types/resources.types.ts';
import {
    ResourceCompareComponent,
} from '@/widget/resources/ResourceCompareComponent/ResourceCompareComponent.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    updateSettingsServiceByTargetRequestAction,
} from '@/action/settings/service_categories/request-action/updateSettingsServiceByTarget/updateSettingsServiceByTarget.request-action.ts';
import {
    formatDateToDayMonthYear,
    getDatesBetween,
} from '@/helper/lib/date/getDatesBetween/getDatesBetween.ts';
import {
    Validator,
} from '@/validator/Validator.ts';
import {
    CompareTextareaValue,
} from '@/entity/compare/CompareValue/CompareTextareaValue/CompareTextareaValue.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    SettingsService,
} from '@/action/settings/service_categories/const/settings-service.const.ts';
import { Const } from '@/const/Const.ts';
import {
    createSettingsServiceItemByTargetRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceItemByTarget/createSettingsServiceItemByTarget.request-action.ts';
import {
    SETTINGS_SERVICE_ITEM_HEADER_TYPE,
} from '@/widget/settings/service/settingsServiceHeaderTypes.ts';


export type SettingsServiceItemCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        // Сохранить / Обновить для этого пользователя
        clientId: string;
        // Список клиентских сервисов в той же категории
        clientServices?: Array<SettingsServiceData>;
        // Сравниваемый сервис
        targetService: SettingsServiceData;
        // Bearer token для запроса
        bearer: string;
        // IFetcher для запросов
        fetcher?: IFetcher;
        // ILogger для логирования
        logger?: ILogger;
        // Список ресурсов target клиента
        targetResourceList: Array<Resource>;
        // Список ресурсов клиента
        clientResourceList?: Array<Resource>;
    };

export class SettingsServiceItemCompareComponent extends CompareComponent<SettingsServiceData> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private readonly _promiseSplitter: PromiseSplitter;
    private readonly _targetService: SettingsServiceData;
    private _clientServices: Array<SettingsServiceData>;
    private _clientService?: SettingsServiceData;
    private _targetResourceList: Array<Resource>;
    private _clientResourceList: Array<Resource>;
    private _compareResourcesComponents: Array<ICompareEntity<Resource>> = [];

    constructor (props: SettingsServiceItemCompareComponentProps) {
        const {
                  clientServices     = [],
                  clientId,
                  targetService,
                  bearer,
                  fetcher,
                  logger,
                  targetResourceList,
                  clientResourceList = [],
                  ...other
              } = props;
        super(other);

        this._clientId           = clientId;
        this._clientServices     = clientServices;
        this._targetService      = { ...targetService };
        this._bearer             = bearer;
        this._fetcher            = fetcher;
        this._logger             = logger;
        this._targetResourceList = targetResourceList;
        this._clientResourceList = clientResourceList;
        this._clientService      = this._clientServices.find((service) => service.title === this._targetService.title);
        this._promiseSplitter    = new PromiseSplitter(
            PROMISE_SPLITTER_MAX_REQUESTS,
            PROMISE_SPLITTER_MAX_RETRY,
        );

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this, this._clientService));
        this._render();
    }

    public getChildren (): Array<ICompareEntity<Resource>> {
        return this._compareResourcesComponents;
    }

    protected _render () {
        this.element.innerHTML = ``;

        const onlinePrepaidComponents: Array<ICompareComponent>     = [
            new CompareRow({
                label           : 'Предоплата',
                targetValue     : new ComparePriceWithSelectValue({
                    value   : Converter.Settings.Service.priceValue(
                        this._targetService.price_prepaid_amount,
                        this._targetService.price_prepaid_percent,
                    ),
                    onChange: ([ value, type ]) => {
                        if (type === ComparePriceSelectType.RUBLES) {
                            this._targetService.price_prepaid_percent = 0;
                            this._targetService.price_prepaid_amount  = Number(value);
                        } else {
                            this._targetService.price_prepaid_amount  = 0;
                            this._targetService.price_prepaid_percent = Number(value);
                        }

                        this._targetService.online_invoicing_status = Const.Settings.Service.ONLINE_INVOICING_STATUS_ON;
                    },
                }),
                clientValue     : new CompareTextValue({
                    value: Converter.Settings.Service.priceLabel(
                        this._clientService?.price_prepaid_amount,
                        this._clientService?.price_prepaid_percent,
                    ),
                }),
                validationMethod: Validator.Compare.arrayWithString(' '),
            }),
        ];
        const disableOnlineOrderWithoutAbonement: ICompareComponent = new CompareRow({
            label           : 'Запретить онлайн запись без абонемента',
            targetValue     : new CompareToggleValue({
                value   : this._targetService.abonement_restriction_value === Const.Settings.Service.ABONEMENT_RESTRICTION_VALUE_ON,
                onChange: (status) => {
                    enableOnlinePrepaid.enable(!status);

                    if (status) {
                        this._targetService.abonement_restriction_value = Const.Settings.Service.ABONEMENT_RESTRICTION_VALUE_ON;
                    } else {
                        this._targetService.abonement_restriction_value = Const.Settings.Service.ABONEMENT_RESTRICTION_VALUE_OFF;
                    }
                },
            }),
            clientValue     : new CompareTextValue({
                value: this._clientService
                       ? this._clientService.abonement_restriction_value.toString()
                       : undefined,
                label: Converter.Settings.Service.yesOrNo(!!this._clientService?.abonement_restriction_value),
            }),
            validationMethod: (targetValue, clientValue) => {
                // Значение clientValue может быть undefined/1/0
                return targetValue ? clientValue === '1'
                                   : clientValue === undefined || clientValue === '0';
            },
        });

        const enableOnlinePrepaid: ICompareComponent = new CompareRow({
            label           : 'Онлайн запись',
            targetValue     : new CompareToggleValue({
                value                   : !!this._targetService.online_invoicing_status,
                onChange                : (status) => {
                    onlinePrepaidComponents.forEach((component) => component.enable(status));
                    disableOnlineOrderWithoutAbonement.enable(!status);

                    if (status) {
                        this._targetService.online_invoicing_status = SettingsService.onlineInvoicingStatus.ENABLED;
                    } else {
                        this._targetService.online_invoicing_status = SettingsService.onlineInvoicingStatus.DISABLED;
                    }
                },
                executeOnChangeAfterInit: true,
            }),
            clientValue     : new CompareTextValue({
                value: this._clientService
                       ? this._clientService.online_invoicing_status.toString()
                       : undefined,
                label: Converter.Settings.Service.yesOrNo(!!this._clientService?.online_invoicing_status),
            }),
            validationMethod: (targetValue, clientValue) => {
                return targetValue ? clientValue === '2'
                                   : clientValue === '0';
            },
        });

        /**
         * Нужно для деактивации онлайн записи, если запрещена онлайн-запись
         * без абонемента
         */
        if (this._targetService.abonement_restriction_value === SettingsService.abonementRestrictionValue.ENABLED) {
            enableOnlinePrepaid.enable(true);
        }
        // ***

        let bottomDatePicker: CompareDateValue;
        const timepickers: Array<ICompareComponent> = [
            new CompareRow({
                label           : 'Диапазон дат',
                targetValue     : new CompareDateValue({
                    value   : [ this._targetService.date_from, this._targetService.date_to ],
                    range   : true,
                    onChange: (data) => {
                        const range = getDatesBetween(data.dates[0], data.dates.slice(-1)[0]);

                        this._targetService.date_from = data.formatted[0];
                        this._targetService.date_to   = data.formatted.slice(-1)[0];
                        this._targetService.dates     = range.map(formatDateToDayMonthYear);

                        bottomDatePicker.setDateByRange(range);
                    },
                }),
                clientValue     : new CompareDateValue({
                    value  : this._clientService
                             ? [ this._clientService.date_from, this._clientService.date_to ]
                             : undefined,
                    range  : true,
                    disable: true,
                }),
                validationMethod: Validator.Compare.dates,
            }),
            new CompareRow({
                label           : 'Время записи с',
                targetValue     : new CompareTimeRangeValue({
                    value   : Converter.Settings.Service.timeRangeValue(this._targetService.seance_search_start),
                    onChange: ([ hours, minutes ]) => {
                        this._targetService.seance_search_start = hours * 60 * 60 + minutes * 60;
                    },
                }),
                clientValue     : new CompareTextValue({
                    value: this._clientService?.seance_search_start,
                    label: Converter.Settings.Service.timeRangeLabel(this._clientService?.seance_search_start),
                }),
                validationMethod: Validator.Compare.timeRangeWithNumber,
            }),
            new CompareRow({
                label           : 'Время записи до',
                targetValue     : new CompareTimeRangeValue({
                    value   : Converter.Settings.Service.timeRangeValue(this._targetService.seance_search_finish),
                    onChange: ([ hours, minutes ]) => {
                        this._targetService.seance_search_finish = hours * 60 * 60 + minutes * 60;
                    },
                }),
                clientValue     : new CompareTextValue({
                    value: this._clientService?.seance_search_finish,
                    label: Converter.Settings.Service.timeRangeLabel(this._clientService?.seance_search_finish),
                }),
                validationMethod: Validator.Compare.timeRangeWithNumber,
            }),
            new CompareRow({
                label           : 'Выбор дат',
                targetValue     : bottomDatePicker = new CompareDateValue({
                    value        : this._targetService.dates,
                    range        : false,
                    multipleDates: true,
                    onChange     : ({ formatted }) => {
                        this._targetService.dates = formatted;
                    },
                }),
                clientValue     : new CompareDateValue({
                    value        : this._clientService?.dates,
                    range        : false,
                    multipleDates: true,
                    disable      : true,
                }),
                validationMethod: Validator.Compare.dates,
            }),
        ];

        this._compareRows = [
            new CompareBox({
                title     : 'Информация',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetService.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'Id НДС',
                        targetValue: new CompareTextValue({
                            value: this._targetService.vat_id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.vat_id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'Id системы налогообложения',
                        targetValue: new CompareTextValue({
                            value: this._targetService.tax_variant,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.tax_variant,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'Сетевая услуга',
                        targetValue: new CompareTextValue({
                            value: this._targetService.is_chain,
                            label: Converter.Settings.Service.yesOrNo(this._targetService.is_chain),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.is_chain,
                            label: Converter.Settings.Service.yesOrNo(this._clientService?.is_chain),
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'kkm_settings_id',
                        targetValue: new CompareTextValue({
                            value: this._targetService.kkm_settings_id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.kkm_settings_id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'api_id',
                        targetValue: new CompareTextValue({
                            value: this._targetService.api_id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.api_id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'api_service_id',
                        targetValue: new CompareTextValue({
                            value: this._targetService.api_service_id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.api_service_id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'salon_service_id',
                        targetValue: new CompareTextValue({
                            value: this._targetService.salon_service_id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.salon_service_id,
                        }),
                        validate   : false,
                    }),
                    new CompareRow({
                        label      : 'salon_group_service_link',
                        targetValue: new CompareTextValue({
                            value: this._targetService.salon_group_service_link,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.salon_group_service_link,
                        }),
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 3,
                components: [
                    new CompareRow({
                        label      : 'Минимальная цена',
                        targetValue: new CompareTextInputValue({
                            type       : 'number',
                            value      : this._targetService.price_min.toString(),
                            placeholder: 'Пусто',
                            onInput    : (price) => {
                                this._targetService.price_min = Number(price);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_min.toString(),
                        }),
                        disable    : this._clientService?.is_chain,
                    }),
                    new CompareRow({
                        label      : 'Максимальная цена',
                        targetValue: new CompareTextInputValue({
                            type       : 'number',
                            value      : this._targetService.price_max.toString(),
                            placeholder: 'Пусто',
                            onInput    : (price) => {
                                this._targetService.price_max = Number(price);
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_max.toString(),
                        }),
                        disable    : this._clientService?.is_chain,
                    }),
                    new CompareRow({
                        label           : 'Длительность',
                        targetValue     : new CompareTimeSelectsValue({
                            value: Converter.Settings.Service.timeRangeValue(this._targetService.duration),
                        }),
                        clientValue     : new CompareTextValue({
                            value: this._clientService?.duration,
                            label: Converter.Settings.Service.timeRangeLabel(this._clientService?.duration),
                        }),
                        validationMethod: Validator.Compare.timeRangeWithNumber,
                    }),
                    new CompareRow({
                        label      : 'Тип',
                        targetValue: new CompareSelectValue({
                            defaultLabel    : '',
                            defaultValue    : '',
                            showDefaultLabel: false,
                            list            : [
                                {
                                    value   : false,
                                    label   : 'Индивидуальный',
                                    selected: !this._targetService.is_multi,
                                },
                                {
                                    value   : true,
                                    label   : 'Групповой',
                                    selected: this._targetService.is_multi,
                                },
                            ],
                            showValue       : false,
                            variant         : SelectVariantType.MINIMAL,
                            onChange        : (option) => {
                                this._targetService.is_multi = option.value;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.is_multi,
                            label: Converter.Settings.Service.multiType(this._clientService?.is_multi),
                        }),
                    }),
                    new CompareBox({
                        title     : 'Онлайн запись',
                        level     : 3,
                        components: [
                            new CompareRow({
                                label      : 'Картинка',
                                targetValue: new CompareImageValue({
                                    src: this._targetService.image_group?.images?.basic.path,
                                }),
                                clientValue: new CompareImageValue({
                                    src: this._clientService?.image_group?.images?.basic.path,
                                }),
                            }),
                            new CompareRow({
                                label      : 'Название для онлайн записи',
                                targetValue: new CompareTextInputValue({
                                    type       : 'text',
                                    value      : this._targetService.booking_title,
                                    placeholder: 'Пусто',
                                    onInput    : (title) => {
                                        this._targetService.booking_title = title;
                                    },
                                }),
                                clientValue: new CompareTextValue({
                                    value: this._clientService?.booking_title,
                                }),
                                disable    : this._clientService?.is_chain,
                            }),
                            new CompareRow({
                                label      : 'Описание',
                                targetValue: new CompareTextareaValue({
                                    value      : this._targetService.comment,
                                    placeholder: 'Пусто',
                                    onInput    : (comment) => {
                                        this._targetService.comment = comment;
                                    },
                                }),
                                clientValue: new CompareTextValue({
                                    value: this._clientService?.comment,
                                }),
                                disable    : this._clientService?.is_chain,
                            }),
                            enableOnlinePrepaid,
                            ...onlinePrepaidComponents,
                            disableOnlineOrderWithoutAbonement,
                            new CompareRow({
                                label      : 'Услуга доступна ограниченное время',
                                targetValue: new CompareToggleValue({
                                    value                   : !!this._targetService.dates.length || this._targetService.seance_search_start !== 0 || this._targetService.seance_search_finish !== 86400,
                                    onChange                : (status) => {
                                        timepickers.forEach((picker) => picker.enable(status));
                                    },
                                    executeOnChangeAfterInit: true,
                                }),
                                clientValue: new CompareTextValue({
                                    value: Converter.Settings.Service.datesBorderEnabledValue(
                                        this._clientService?.dates,
                                        this._clientService?.seance_search_start,
                                        this._clientService?.seance_search_finish,
                                    ),
                                    label: Converter.Settings.Service.datesBorderEnabledLabel(
                                        this._clientService?.dates,
                                        this._clientService?.seance_search_start,
                                        this._clientService?.seance_search_finish,
                                    ),
                                }),
                            }),
                            ...timepickers,
                        ],
                    }),
                ],
            }),
        ];

        this._compareChildren = [
            new CompareBox({
                level     : 4,
                title     : 'Ресурсы',
                components: this._compareResourcesComponents = this._targetService.resources
                    .map((resourceId) => {
                        const targetResource = this._targetResourceList.find((resource) => resource.id === resourceId.toString());

                        if (targetResource) {
                            return new ResourceCompareComponent({
                                clientId       : this._clientId,
                                targetResource : targetResource,
                                clientResources: this._clientResourceList,
                                logger         : this._logger,
                                fetcher        : this._fetcher,
                            });
                        }
                    })
                    .filter((component) => !!component),
            }),
        ];

        this._header = new CompareHeader({
            label                 : 'Сервис',
            targetHeaderData      : this._targetService.title,
            clientHeaderData      : this._clientService?.title,
            variants              : this._clientServices
                .map((service) => ({
                    label   : service.title,
                    value   : service.id.toString(),
                    selected: service.id === this._clientService?.id,
                })),
            rows                  : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            onVariantChange       : (e) => {
                this._clientService = this._clientServices.find((service) => service.id.toString() === e.value);
                this._render();
                this.element.dispatchEvent(CompareEvent);
            },
            onRename              : (title: string) => {
                this._targetService.title = title;
            },
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
            disable               : this._clientService?.is_chain,
            type                  : SETTINGS_SERVICE_ITEM_HEADER_TYPE,
        });

        this._revalidate(this._clientService);
        this._header.insert(this.element, 'beforeend');
    }

    protected async _action (categoryId: string) {
        if (this._clientService) {
            if (this._itemIsValid()) {
                if (this._childrenIsValid()) {
                    // return item
                    return this._clientService;
                } else {
                    // action children
                    const children = await new PromiseSplitter(1, 3)
                        .exec<Resource>(
                            this._compareResourcesComponents.map((component) => ({
                                chain: [ component.getAction() ],
                            })),
                        );

                    this._clientService.resources = children.filter(Boolean).map((resource) => Number(resource.id));

                    // update item
                    return await updateSettingsServiceByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientService,
                        this._clientService,
                        this._fetcher,
                        this._logger,
                    );
                    // return item
                }
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    return await updateSettingsServiceByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientService,
                        this._targetService,
                        this._fetcher,
                        this._logger,
                    );
                    // return item
                } else {
                    // action children
                    const children = await new PromiseSplitter(1, 3)
                        .exec<Resource>(
                            this._compareResourcesComponents.map((component) => ({
                                chain: [ component.getAction() ],
                            })),
                        );

                    this._clientService.resources = children.filter(Boolean).map((resource) => Number(resource.id));
                    // update item
                    return await updateSettingsServiceByTargetRequestAction(
                        this._bearer,
                        this._clientId,
                        this._clientService,
                        this._targetService,
                        this._fetcher,
                        this._logger,
                    );
                    // return item
                }
            }
        } else {
            if (!this._isNoCreateNew()) {
                // create item

                const [ service ] = await new PromiseSplitter(1, 3)
                    .exec([
                        {
                            chain: [
                                () => this._promiseSplitter.exec<Resource>(
                                    this._compareResourcesComponents.map((component) => ({
                                        chain: [ component.getAction() ],
                                    })),
                                ),
                                async (resources: unknown) => {
                                    const item = await createSettingsServiceItemByTargetRequestAction(
                                        this._bearer,
                                        this._clientId,
                                        Number(categoryId),
                                        this._targetService,
                                        ((resources ?? []) as Array<Resource>).map((resource) => Number(resource.id)),
                                        this._fetcher,
                                        this._logger,
                                    );

                                    return await updateSettingsServiceByTargetRequestAction(
                                        this._bearer,
                                        this._clientId,
                                        item,
                                        this._targetService,
                                        this._fetcher,
                                        this._logger,
                                    );
                                },
                            ],
                        },
                    ]);

                return service as SettingsServiceData;

                // return item
            }
        }


        return null;
    }
}