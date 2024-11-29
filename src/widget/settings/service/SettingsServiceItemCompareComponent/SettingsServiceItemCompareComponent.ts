import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareType,
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { CompareRowV3 } from '@/entity/compare/v3/CompareRowV3/CompareRowV3.ts';
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

export class SettingsServiceItemCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private _clientId: string;
    private _clientServices: Array<SettingsServiceData>;
    private _targetService: SettingsServiceData;
    private _compareComponents: Array<ICompareComponent> = [];
    private _clientService?: SettingsServiceData;
    private _header?: CompareHeaderV3;
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
        super('div', other);

        this._clientId       = clientId;
        this._clientServices = clientServices;
        this._targetService  = targetService;
        this._bearer         = bearer;
        this._fetcher        = fetcher;
        this._logger         = logger;
        this._clientService  = this._clientServices.find((service) => service.title === this._targetService.title);

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this));
        this._render();
    }

    get isValid () {
        return (
            this._clientService !== undefined &&
            (this._header?.isValid ?? false) &&
            this._compareComponents.every((component) => component.isValid)
        );
    }

    getAction (categoryId: string): () => Promise<void> {
        return async () => {
            if (this._clientService !== undefined) {
                if (this.isValid) {
                    console.log('NOTHING');
                } else {
                    console.log(`UPDATE SERVICE "${ this._clientService.title }" [${ this._clientService.id }] FOR [${ categoryId }] :${ this._clientId }`);
                }
            } else {
                console.log(`CREATE NEW SERVICE "${ this._targetService.title }" FOR [${ categoryId }] :${ this._clientId }`);
                createSettingsServiceItemRequestAction(
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
                        staff                   : [],
                        image_group             : this._targetService.image_group,
                        image                   : this._targetService.image_group
                                                  ? await base64ImageLoad(this._targetService.image_group.images.basic.path)
                                                  : undefined,
                    },
                    this._fetcher,
                    this._logger,
                );
            }
        };
    }

    private _render () {
        this.element.innerHTML  = ``;
        this._compareComponents = [
            new CompareImageRowV3({
                targetImage: this._targetService.image_group?.images?.basic.path,
                clientImage: this._clientService?.image_group?.images?.basic.path,
                label      : 'Картинка',
            }),
            new CompareTextInputRowV3({
                targetData: this._targetService.booking_title,
                clientData: this._clientService?.booking_title,
                label     : 'Букинг заголовок',
            }),
            new CompareTextInputRowV3({
                targetData: this._targetService.comment,
                clientData: this._clientService?.comment,
                label     : 'Комментарий',
            }),
            new CompareTextInputRowV3({
                targetData: this._targetService.discount.toString(),
                clientData: this._clientService?.discount.toString(),
                label     : 'Скидка',
                type      : 'number',
            }),
            new CompareRowV3({
                targetData: this._targetService.translations.filter((translation) => translation.translation).length.toString(),
                clientData: this._clientService?.translations.filter((translation) => translation.translation).length.toString(),
                label     : 'Переводы',
            }),
        ];

        this._header = new CompareHeaderV3({
            targetHeaderData: this._targetService.title,
            clientHeaderData: this._clientService?.title,
            label           : 'Сервис',
            variants        : this._clientServices
                .map((service) => ({
                    label   : service.title,
                    value   : service.id.toString(),
                    selected: service.id === this._clientService?.id,
                })),
            rows            : this._compareComponents,
            onVariantChange : (e) => {
                this._clientService = this._clientServices.find((service) => service.id.toString() === e.value);
                this._render();
                this.element.dispatchEvent(CompareEvent);
            },
            onRename        : (title: string) => {
                this._targetService.title = title;
            },
        });

        this._revalidate();
        this._header.insert(this.element, 'beforeend');
    }

    private _revalidate () {
        if (this._clientService === undefined) {
            this._header?.setValidationType(CompareType.NO_EXIST);
        } else if (!this.isValid) {
            this._header?.setValidationType(CompareType.NO_VALID);
        } else {
            this._header?.setValidationType(CompareType.VALID);
        }
    }
}