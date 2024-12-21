import {
    CompareType,
    ICompareComponent,
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
import {
    createSettingsServiceItemRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceItem/createSettingsServiceItem.request-action.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import { isArray } from '@vanyamate/types-kit';
import {
    updateSettingsServiceByTargetRequestAction,
} from '@/action/settings/service_categories/request-action/updateSettingsServiceByTarget/updateSettingsServiceByTarget.request-action.ts';
import {
    formatDateToDayMonthYear,
    getDatesBetween,
} from '@/helper/lib/date/getDatesBetween/getDatesBetween.ts';
import {
    validateDates,
} from '@/entity/compare/CompareValue/CompareDateValue/lib/validateDates.ts';
import {
    CompareTextareaValue,
} from '@/entity/compare/CompareValue/CompareTextareaValue/CompareTextareaValue.ts';
import { Converter } from '@/converter/Converter.ts';


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

export class SettingsServiceItemCompareComponent extends CompareComponent<SettingsServiceData> implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private readonly _promiseSplitter: PromiseSplitter;
    private _clientServices: Array<SettingsServiceData>;
    private _targetService: SettingsServiceData;
    private _clientService?: SettingsServiceData;
    private _targetResourceList: Array<Resource>;
    private _clientResourceList: Array<Resource>;
    private _compareResourcesComponents: Array<ResourceCompareComponent> = [];

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
        this._targetService      = targetService;
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

    protected _render () {
        this.element.innerHTML = ``;

        const prepaidTargetPercents                                 = this._targetService.price_prepaid_amount === 0;
        const onlinePrepaidComponents: Array<ICompareComponent>     = [
            new CompareRow({
                targetValue     : new ComparePriceWithSelectValue({
                    value: [
                        prepaidTargetPercents
                        ? this._targetService.price_prepaid_percent.toString()
                        : this._targetService.price_prepaid_amount.toString(),
                        prepaidTargetPercents ? ComparePriceSelectType.PERCENTS
                                              : ComparePriceSelectType.RUBLES,
                    ],
                }),
                clientValue     : new CompareTextValue({
                    value: this._clientService ?
                           this._clientService.price_prepaid_amount
                           ? `${ this._clientService.price_prepaid_amount } ₽`
                           : `${ this._clientService.price_prepaid_percent } %`
                                               : undefined,
                }),
                label           : 'Предоплата',
                validationMethod: (targetValue, clientValue) => {
                    if (targetValue && clientValue) {
                        return targetValue.join(' ') === clientValue;
                    }

                    return targetValue === clientValue;
                },
            }),
        ];
        const disableOnlineOrderWithoutAbonement: ICompareComponent = new CompareRow({
            targetValue     : new CompareToggleValue({
                value                   : this._targetService.abonement_restriction_value === 1,
                onChange                : (status) => {
                    // Осуждаю
                    requestAnimationFrame(() => {
                        enableOnlinePrepaid.enable(!status);
                    });
                },
                executeOnChangeAfterInit: true,
            }),
            clientValue     : new CompareTextValue({
                value: this._clientService
                       ? this._clientService.abonement_restriction_value.toString()
                       : undefined,
                label: this._clientService?.abonement_restriction_value
                       ? 'Да' : 'Нет',
            }),
            label           : 'Запретить онлайн запись без абонемента',
            validationMethod: (targetValue, clientValue) => {
                return targetValue ? clientValue === '1'
                                   : clientValue === undefined || clientValue === '0';
            },
        });

        const enableOnlinePrepaid: ICompareComponent = new CompareRow({
            targetValue     : new CompareToggleValue({
                value                   : !!this._targetService.online_invoicing_status,
                onChange                : (status) => {
                    onlinePrepaidComponents.forEach((component) => component.enable(status));
                    disableOnlineOrderWithoutAbonement.enable(!status);
                },
                executeOnChangeAfterInit: true,
            }),
            clientValue     : new CompareTextValue({
                value: this._clientService
                       ? this._clientService.online_invoicing_status.toString()
                       : undefined,
                label: this._clientService?.online_invoicing_status
                       ? 'Да' : 'Нет',
            }),
            label           : 'Онлайн запись',
            validationMethod: (targetValue, clientValue) => {
                return targetValue ? clientValue === '2'
                                   : clientValue === '0';
            },
        });

        let bottomDatePicker: CompareDateValue;
        const timepickers: Array<ICompareComponent> = [
            new CompareRow({
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
                label           : 'Диапазон дат',
                validationMethod: validateDates,
            }),
            new CompareRow({
                targetValue     : new CompareTimeRangeValue({
                    value: [
                        Math.floor(this._targetService.seance_search_start / 60 / 60),
                        Math.floor(this._targetService.seance_search_start / 60 % 60),
                    ],
                }),
                clientValue     : new CompareTextValue({
                    value: this._clientService ?
                           `${ Math.floor(this._clientService.seance_search_start / 60 / 60) }ч ${ Math.floor(this._clientService.seance_search_start / 60 % 60) }м`
                                               : undefined,
                }),
                label           : 'Время записи с',
                validationMethod: (targetValue, clientValue) => {
                    if (targetValue && clientValue) {
                        return `${ targetValue[0] }ч ${ targetValue[1] }м` === clientValue;
                    }

                    return targetValue === clientValue;
                },
            }),
            new CompareRow({
                targetValue     : new CompareTimeRangeValue({
                    value: [
                        Math.floor(this._targetService.seance_search_finish / 60 / 60),
                        Math.floor(this._targetService.seance_search_finish / 60 % 60),
                    ],
                }),
                clientValue     : new CompareTextValue({
                    value: this._clientService ?
                           `${ Math.floor(this._clientService.seance_search_finish / 60 / 60) }ч ${ Math.floor(this._clientService.seance_search_finish / 60 % 60) }м`
                                               : undefined,
                }),
                label           : 'Время записи до',
                validationMethod: (targetValue, clientValue) => {
                    if (targetValue && clientValue) {
                        return `${ targetValue[0] }ч ${ targetValue[1] }м` === clientValue;
                    }

                    return targetValue === clientValue;
                },
            }),
            new CompareRow({
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
                label           : 'Выбор дат',
                validationMethod: validateDates,
            }),
        ];

        this._compareRows = [
            new CompareBox({
                level     : 3,
                title     : 'Информация',
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
                            label: this._targetService.is_chain ? 'Да' : 'Нет',
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.is_chain,
                            label: this._clientService?.is_chain ? 'Да' : 'Нет',
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
                level     : 3,
                title     : 'Основные настройки',
                components: [
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            type       : 'number',
                            value      : this._targetService.price_min.toString(),
                            placeholder: 'Пусто',
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_min.toString(),
                        }),
                        label      : 'Минимальная цена',
                        disable    : this._clientService?.is_chain,
                    }),
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            type       : 'number',
                            value      : this._targetService.price_max.toString(),
                            placeholder: 'Пусто',
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_max.toString(),
                        }),
                        label      : 'Максимальная цена',
                        disable    : this._clientService?.is_chain,
                    }),
                    new CompareRow({
                        targetValue     : new CompareTimeSelectsValue({
                            value: [
                                Math.floor(this._targetService.duration / 60 / 60).toString(),
                                Math.floor(this._targetService.duration / 60 % 60).toString(),
                            ],
                        }),
                        clientValue     : new CompareTextValue({
                            value: Converter.Settings.Service.duration(this._clientService?.duration),
                        }),
                        label           : 'Длительность',
                        validationMethod: (targetValue, clientValue) => {
                            if (targetValue !== null && clientValue !== null) {
                                return `${ targetValue[0] }ч ${ targetValue[1] }м` === clientValue;
                            }

                            return targetValue === clientValue;
                        },
                    }),
                    new CompareRow({
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
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.is_multi,
                            label: Converter.Settings.Service.type(this._clientService?.is_multi),
                        }),
                        label      : 'Тип',
                    }),
                    new CompareBox({
                        title     : 'Онлайн запись',
                        level     : 3,
                        components: [
                            new CompareRow({
                                targetValue: new CompareImageValue({
                                    src: this._targetService.image_group?.images?.basic.path,
                                }),
                                clientValue: new CompareImageValue({
                                    src: this._clientService?.image_group?.images?.basic.path,
                                }),
                                label      : 'Картинка',
                            }),
                            new CompareRow({
                                targetValue: new CompareTextInputValue({
                                    type       : 'text',
                                    value      : this._targetService.booking_title,
                                    placeholder: 'Пусто',
                                }),
                                clientValue: new CompareTextValue({
                                    value: this._clientService?.booking_title,
                                }),
                                label      : 'Название для онлайн записи',
                                disable    : this._clientService?.is_chain,
                            }),
                            new CompareRow({
                                targetValue: new CompareTextareaValue({
                                    value      : this._targetService.comment,
                                    placeholder: 'Пусто',
                                }),
                                clientValue: new CompareTextValue({
                                    value: this._clientService?.comment,
                                }),
                                label      : 'Описание',
                                disable    : this._clientService?.is_chain,
                            }),
                            enableOnlinePrepaid,
                            ...onlinePrepaidComponents,
                            disableOnlineOrderWithoutAbonement,
                            new CompareRow({
                                targetValue: new CompareToggleValue({
                                    value                   : !!this._targetService.dates.length || this._targetService.seance_search_start !== 0 || this._targetService.seance_search_finish !== 86400,
                                    onChange                : (status) => {
                                        timepickers.forEach((picker) => picker.enable(status));
                                    },
                                    executeOnChangeAfterInit: true,
                                }),
                                clientValue: new CompareTextValue({
                                    value: this._clientService
                                           ? (!!this._clientService?.dates.length || this._clientService?.seance_search_start !== 0 || this._clientService?.seance_search_finish !== 86400)
                                           : undefined,
                                    label: this._clientService
                                           ? (!!this._clientService?.dates.length || this._clientService?.seance_search_start !== 0 || this._clientService?.seance_search_finish !== 86400)
                                             ? 'Да' : 'Нет'
                                           : undefined,
                                }),
                                label      : 'Услуга доступна ограниченное время',
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
            targetHeaderData      : this._targetService.title,
            clientHeaderData      : this._clientService?.title,
            label                 : 'Сервис',
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
                                    if (isArray(resources)) {
                                        return createSettingsServiceItemRequestAction(
                                            this._bearer,
                                            this._clientId,
                                            {
                                                ...this._targetService,
                                                chain_details           : {
                                                    comment                         : '',
                                                    is_comment_managed_only_in_chain: false,
                                                    is_price_managed_only_in_chain  : false,
                                                    price_max                       : 0,
                                                    price_min                       : 0,
                                                },
                                                delete_image            : false,
                                                is_category             : false,
                                                category_id             : Number(categoryId),
                                                is_linked_to_composite  : this._targetService.is_linked_to_composite,
                                                is_range_price_enabled  : this._targetService.price_min !== this._targetService.price_max,
                                                kkm_settings_id         : 0,
                                                salon_group_title       : '',
                                                salon_group_service_link: '',
                                                salon_service_id        : 0,
                                                translations            : this._targetService.translations.filter((translation) => translation.translation),
                                                resources               : (resources as Array<Resource>).filter(Boolean).map((resource) => Number(resource.id)), // CREATE TOO
                                                staff                   : [],
                                                image_group             : this._targetService.image_group,
                                                image                   : this._targetService.image_group?.images?.basic?.path
                                                                          ? await base64ImageLoad(this._targetService.image_group.images.basic.path)
                                                                          : undefined,
                                                id                      : 0,
                                                vat_id                  : -1,
                                                tax_variant             : -1,
                                                is_chain                : false,
                                            },
                                            this._fetcher,
                                            this._logger,
                                        );
                                    }
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