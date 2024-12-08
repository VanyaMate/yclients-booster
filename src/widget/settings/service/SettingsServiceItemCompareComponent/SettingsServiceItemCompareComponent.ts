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

        const online: Array<ICompareComponent> = [
            new CompareRow({
                targetValue: new CompareTextInputValue({
                    type : 'number',
                    value: this._targetService.price_min.toString(),
                }),
                clientValue: new CompareTextValue({
                    value: this._clientService?.price_min.toString(),
                }),
                label      : 'Время до',
            }),
            new CompareRow({
                targetValue: new CompareTextInputValue({
                    type : 'number',
                    value: this._targetService.price_min.toString(),
                }),
                clientValue: new CompareTextValue({
                    value: this._clientService?.price_min.toString(),
                }),
                label      : 'Время после',
            }),
        ];

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
                        targetValue: new CompareTextInputValue({
                            type : 'number',
                            value: this._targetService.duration.toString(),
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientService?.duration.toString(),
                        }),
                        label      : 'Длительность',
                    }),
                    new CompareRow<boolean, string>({
                        targetValue     : new CompareToggleValue({
                            value                   : !!this._targetService.online_invoicing_status,
                            onChange                : (status) => {
                                online.forEach((com) => com.enable(status));
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
                    }),
                    ...online,
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