import { ComponentPropsOptional } from '@/shared/component/Component.ts';
import {
    CompareProcess,
    CompareType,
    ICompareComponentV3,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';
import {
    createSettingsServiceItemRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceItem/createSettingsServiceItem.request-action.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    base64ImageLoad,
} from '@/action/common/base64-image-loader/base64-image-loader.request-action.ts';
import {
    CompareImageRowV3,
} from '@/entity/compare/v3/CompareImageRowV3/CompareImageRowV3.ts';
import {
    CompareTextInputRowV3,
} from '@/entity/compare/v3/CompareTextInputRowV3/CompareTextInputRowV3.ts';
import { CompareBoxV3 } from '@/entity/compare/v3/CompareBoxV3/CompareBoxV3.ts';
import {
    CompareComponentV3,
} from '@/entity/compare/v3/CompareComponent/CompareComponentV3.ts';
import {
    CompareSelectRowV3,
} from '@/entity/compare/v3/CompareSelectRowV3/CompareSelectRowV3.ts';
import {
    CompareEnableBoxV3,
} from '@/entity/compare/v3/CompareEnableBoxV3/CompareEnableBoxV3.ts';


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

export class SettingsServiceItemCompareComponent extends CompareComponentV3 implements ICompareComponentV3 {
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
        this._compareRows      = [
            new CompareBoxV3({
                level     : 3,
                title     : 'Основные настройки',
                components: [
                    new CompareTextInputRowV3({
                        targetData: this._targetService.price_min.toString(),
                        clientData: this._clientService?.price_min.toString(),
                        label     : 'Минимальная цена',
                        type      : 'number',
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.price_max.toString(),
                        clientData: this._clientService?.price_max.toString(),
                        label     : 'Максимальная цена',
                        type      : 'number',
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.duration.toString(),
                        clientData: this._clientService?.duration.toString(),
                        label     : 'Длительность',
                        type      : 'number',
                    }),
                    new CompareSelectRowV3({
                        targetSelectData   : {
                            defaultLabel    : '',
                            defaultValue    : '',
                            showDefaultLabel: false,
                            list            : [
                                {
                                    value   : '0',
                                    label   : 'Индивидуальная',
                                    selected: !this._targetService.is_multi,
                                },
                                {
                                    value   : '1',
                                    label   : 'Групповая',
                                    selected: this._targetService.is_multi,
                                },
                            ],
                            showValue       : false,
                        },
                        label              : 'Тип услуги',
                        clientSelectedId   : this._clientService
                                             ? this._clientService.is_multi
                                               ? '1' : '0'
                                             : undefined,
                        clientSelectedLabel: this._clientService
                                             ? this._clientService.is_multi
                                               ? 'Групповая' : 'Индивидуальная'
                                             : undefined,
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.capacity.toString(),
                        clientData: this._clientService?.capacity.toString(),
                        label     : 'Вместимость',
                        type      : 'number',
                    }),
                ],
            }),
            new CompareBoxV3({
                level     : 3,
                title     : 'Онлайн запись',
                components: [
                    new CompareImageRowV3({
                        targetImage: this._targetService.image_group?.images?.basic.path,
                        clientImage: this._clientService?.image_group?.images?.basic.path,
                        label      : 'Картинка',
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.booking_title,
                        clientData: this._clientService?.booking_title,
                        label     : 'Название для онлайн записи',
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.comment,
                        clientData: this._clientService?.comment,
                        label     : 'Описание',
                    }),
                    new CompareSelectRowV3({
                        targetSelectData   : {
                            defaultLabel    : '',
                            defaultValue    : '',
                            showDefaultLabel: false,
                            list            : [
                                {
                                    value   : '0',
                                    label   : 'Выключена',
                                    selected: this._targetService.prepaid === 'forbidden',
                                },
                                {
                                    value   : '1',
                                    label   : 'Включена',
                                    selected: this._targetService.prepaid !== 'forbidden',
                                },
                            ],
                            showValue       : false,
                        },
                        label              : 'Онлайн предоплата',
                        clientSelectedId   : this._clientService
                                             ? this._clientService.prepaid === 'forbidden'
                                               ? '0' : '1'
                                             : undefined,
                        clientSelectedLabel: this._clientService
                                             ? this._clientService.prepaid === 'forbidden'
                                               ? 'Выключена' : 'Включена'
                                             : undefined,
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.price_prepaid_amount.toString(),
                        clientData: this._clientService?.price_prepaid_amount.toString(),
                        label     : 'Предоплата Руб',
                        type      : 'number',
                    }),
                    new CompareTextInputRowV3({
                        targetData: this._targetService.price_prepaid_percent.toString(),
                        clientData: this._clientService?.price_prepaid_percent.toString(),
                        label     : 'Предоплата %',
                        type      : 'number',
                    }),
                    new CompareEnableBoxV3({
                        label       : 'Запись без абонемента',
                        components  : [
                            new CompareTextInputRowV3({
                                targetData: this._targetService.seance_search_start.toString(),
                                clientData: this._clientService?.seance_search_start.toString(),
                                label     : 'Запись доступна с',
                                type      : 'number',
                            }),
                            new CompareTextInputRowV3({
                                targetData: this._targetService.seance_search_finish.toString(),
                                clientData: this._clientService?.seance_search_finish.toString(),
                                label     : 'Запись доступна до',
                                type      : 'number',
                            }),
                        ],
                        onToggle    : () => {
                        },
                        targetStatus: this._targetService.abonement_restriction_value === 1,
                        clientStatus: this._clientService === undefined
                                      ? undefined
                                      : this._clientService.abonement_restriction_value === 1,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeaderV3({
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