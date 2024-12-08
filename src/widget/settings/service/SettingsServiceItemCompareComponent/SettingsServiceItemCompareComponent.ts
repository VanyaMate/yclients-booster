import {
    CompareProcess,
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
    createSettingsServiceItemRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceItem/createSettingsServiceItem.request-action.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
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
    };

export class SettingsServiceItemCompareComponent extends CompareComponent implements ICompareComponent {
    private _clientId: string;
    private _clientServices: Array<SettingsServiceData>;
    private _targetService: SettingsServiceData;
    private _clientService?: SettingsServiceData;
    private _bearer: string;
    private _fetcher?: IFetcher;
    private _logger?: ILogger;

    constructor (props: SettingsServiceItemCompareComponentProps) {
        const {
                  clientServices = [],
                  clientId,
                  targetService,
                  bearer,
                  fetcher,
                  logger,
                  ...other
              } = props;
        super(other);

        this._clientId       = clientId;
        this._clientServices = clientServices;
        this._targetService  = targetService;
        this._bearer         = bearer;
        this._fetcher        = fetcher;
        this._logger         = logger;
        this._clientService  = this._clientServices.find((service) => service.title === this._targetService.title);

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this, this._clientService));
        this._render();
    }

    get isValid () {
        if (this._enabled) {
            return (
                this._clientService !== undefined &&
                (
                    this._header
                    ? this._header.isValid
                    : (this._clientService.title === this._targetService.title)
                ) &&
                this._compareRows.every((row) => row.isValid) &&
                this._compareChildren.every((child) => child.isValid)
            );
        }

        return true;
    }

    getAction (categoryId: string): () => Promise<void> {
        if (this._enabled) {
            this._onBeforeAction();
            return async () => {
                this._onStartAction();
                switch (this._compareType) {
                    case CompareType.ITEM:
                        // only create/update item
                        await this._itemAction(categoryId)
                            .then(this._onSuccessAction.bind(this))
                            .catch(this._onErrorAction.bind(this));
                        return;
                    case CompareType.CHILDREN:
                        // if exist - create/update children
                        await this._childrenAction();
                        return;
                    case CompareType.ALL:
                        // all
                        await this._itemAction(categoryId)
                            .then(this._onSuccessAction.bind(this))
                            .catch(this._onErrorAction.bind(this));
                        await this._childrenAction();
                        return;
                    default:
                        return;
                }
            };
        }

        return async () => {
        };
    }

    private _render () {
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
        const disableOnlineOrderWithoutAbonement: ICompareComponent = new CompareRow<boolean, string>({
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
                       ? 'Вкл' : 'Выкл',
            }),
            label           : 'Запретить онлайн запись без абонемента',
            validationMethod: (targetValue, clientValue) => {
                return targetValue ? clientValue === '1'
                                   : clientValue === undefined || clientValue === '0';
            },
        });

        const enableOnlinePrepaid: ICompareComponent = new CompareRow<boolean, string>({
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
                       ? 'Вкл' : 'Выкл',
            }),
            label           : 'Онлайн запись',
            validationMethod: (targetValue, clientValue) => {
                return targetValue ? clientValue === '2'
                                   : clientValue === '0';
            },
        });

        this._compareRows = [
            new CompareBox({
                level     : 3,
                title     : 'Основные настройки',
                components: [
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            type : 'number',
                            value: this._targetService.price_min.toString(),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_min.toString(),
                        }),
                        label      : 'Минимальная цена',
                    }),
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            type : 'number',
                            value: this._targetService.price_max.toString(),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.price_max.toString(),
                        }),
                        label      : 'Максимальная цена',
                    }),
                    new CompareRow({
                        targetValue     : new CompareTimeSelectsValue({
                            value: [
                                Math.floor(this._targetService.duration / 60 / 60).toString(),
                                Math.floor(this._targetService.duration / 60 % 60).toString(),
                            ],
                        }),
                        clientValue     : new CompareTextValue({
                            value: this._clientService
                                   ? `${ Math.floor(this._clientService.duration / 60 / 60).toString() }ч ${ Math.floor(this._clientService.duration / 60 % 60).toString() }м`
                                   : undefined,
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
                                    value   : 'Индивидуальный',
                                    label   : 'Индивидуальный',
                                    selected: !this._targetService.is_multi,
                                },
                                {
                                    value   : 'Групповой',
                                    label   : 'Групповой',
                                    selected: this._targetService.is_multi,
                                },
                            ],
                            showValue       : false,
                            variant         : SelectVariantType.MINIMAL,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService
                                   ? this._clientService.is_multi ? 'Групповой'
                                                                  : 'Индивидуальный'
                                   : undefined,
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
                            enableOnlinePrepaid,
                            ...onlinePrepaidComponents,
                            disableOnlineOrderWithoutAbonement,
                        ],
                    }),
                ],
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
            rows                  : this._compareRows,
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

    private async _itemAction (categoryId: string) {
        if (this.isValid) {
            console.log('Nothing');
            return;
        }

        if (this._clientService) {
            console.log('update service', this._clientService.id);
            return;
        }

        console.log(`CREATE NEW SERVICE "${ this._targetService.title }" FOR [${ categoryId }] :${ this._clientId }`);
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
                salon_group_service_link: '',
                salon_group_title       : '',
                salon_service_id        : 0,
                translations            : this._targetService.translations.filter((translation) => translation.translation),
                resources               : [], // CREATE TOO
                staff                   : [],
                image_group             : this._targetService.image_group,
                image                   : this._targetService.image_group?.images?.basic?.path
                                          ? await base64ImageLoad(this._targetService.image_group.images.basic.path)
                                          : undefined,
                id                      : 0,
                vat_id                  : -1,
                tax_variant             : -1,
            },
            this._fetcher,
            this._logger,
        );
    }

    private async _childrenAction () {
        // ресурсы?
    }

    private _onBeforeAction () {
        this._header?.setProcessType(CompareProcess.IDLE);
    }

    private _onStartAction () {
        this._header?.setProcessType(CompareProcess.PROCESS);
    }

    private _onSuccessAction () {
        this._header?.setProcessType(CompareProcess.SUCCESS);
    }

    private _onErrorAction () {
        this._header?.setProcessType(CompareProcess.ERROR);
    }
}