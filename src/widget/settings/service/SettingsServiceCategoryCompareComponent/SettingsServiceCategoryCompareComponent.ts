import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareType,
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';
import { CompareRowV3 } from '@/entity/compare/v3/CompareRowV3/CompareRowV3.ts';
import {
    SettingsServiceItemCompareComponent,
} from '@/widget/settings/service/SettingsServiceItemCompareComponent/SettingsServiceItemCompareComponent.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    createSettingsServiceCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceCategory/createSettingsServiceCategory.request-action.ts';


export type SettingsServiceCategoryCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        // Сохранить / Обновить для этого пользователя
        clientId: string;
        // Текущие данные пользователя
        clientData: SettingsServiceCopyData;
        // Сравниваемая категория
        targetCategory: SettingsServiceCategoryDataWithChildren;
        // Bearer token для запроса
        bearer: string;
        // IFetcher для запросов
        fetcher?: IFetcher;
        // ILogger для логирования
        logger?: ILogger;
    };

export class SettingsServiceCategoryCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetCategory: SettingsServiceCategoryDataWithChildren;
    private _compareComponents: Array<ICompareComponent>                   = [];
    private _serviceComponents: Array<SettingsServiceItemCompareComponent> = [];
    private _clientCategory?: SettingsServiceCategoryDataWithChildren;
    private _header?: CompareHeaderV3;
    private _bearer: string;
    private _fetcher?: IFetcher;
    private _logger?: ILogger;

    constructor (props: SettingsServiceCategoryCompareComponentProps) {
        const {
                  targetCategory,
                  clientData,
                  clientId,
                  bearer,
                  fetcher,
                  logger,
                  ...other
              } = props;
        super('div', other);

        this._clientId       = clientId;
        this._clientData     = clientData;
        this._targetCategory = targetCategory;
        this._bearer         = bearer;
        this._fetcher        = fetcher;
        this._logger         = logger;
        this._clientCategory = this._clientData.tree.find((category) => category.title === this._targetCategory.title);

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this));
        this._render();
    }

    get isValid () {
        return (
            this._currentCategoryIsValid() &&
            this._childrenIsValid()
        );
    }

    getAction (): () => Promise<void> {
        return async () => {
            if (this._clientCategory !== undefined) {
                if (this._currentCategoryIsValid()) {
                    if (this._childrenIsValid()) {
                        console.log('NOTHING');
                    } else {
                        Promise.all(this._serviceComponents.map((component) => component.getAction(this._clientCategory!.id.toString())()));
                    }
                } else {
                    console.log(`UPDATE CATEGORY [${ this._clientCategory.id }] FOR`, this._clientId);
                    Promise.all(this._serviceComponents.map((component) => component.getAction(this._clientCategory!.id.toString())()));
                }
            } else {
                const id = Math.random().toString(16);
                console.log('CREATE NEW CATEGORY FOR', id, this._clientId);
                createSettingsServiceCategoryRequestAction(this._bearer, this._clientId, {
                    title        : this._targetCategory.title,
                    service_count: 0,
                    services     : [],
                    translations : this._targetCategory.translations,
                    staff        : [],
                    api_id       : this._targetCategory.api_id,
                    booking_title: this._targetCategory.booking_title ?? this._targetCategory.title,
                }, this._fetcher, this._logger)
                    .then((response) => Promise.all(this._serviceComponents.map((component) => component.getAction(response.id.toString())())));
            }
        };
    }

    private _currentCategoryIsValid () {
        return (
            this._clientCategory !== undefined &&
            (this._header?.isValid ?? false) &&
            this._compareComponents.every((component) => component.isValid)
        );
    }

    private _childrenIsValid () {
        return this._serviceComponents.every((component) => component.isValid);
    }

    private _render () {
        this.element.innerHTML  = ``;
        this._serviceComponents = this._targetCategory.children.map((service) => (
            new SettingsServiceItemCompareComponent({
                clientId      : this._clientId,
                targetService : service,
                clientServices: this._clientCategory?.children,
                bearer        : this._bearer,
                fetcher       : this._fetcher,
                logger        : this._logger,
            })
        ));

        this._compareComponents = [
            new CompareRowV3({
                targetData: this._targetCategory.booking_title,
                clientData: this._clientCategory?.booking_title,
                label     : 'Букинг заголовок',
            }),
            new CompareRowV3({
                targetData: this._targetCategory.sex ? 'Муж' : 'Жен',
                clientData: this._clientCategory?.sex === undefined
                            ? undefined : this._clientCategory.sex ? 'Муж'
                                                                   : 'Жен',
                label     : 'Пол',
            }),
            new CompareRowV3({
                targetData: this._targetCategory.translations.length.toString(),
                clientData: this._clientCategory?.translations.length.toString(),
                label     : 'Переводы',
            }),
        ];

        this._header = new CompareHeaderV3({
            targetHeaderData: this._targetCategory.title,
            clientHeaderData: this._clientCategory?.title,
            label           : 'Категория',
            variants        : this._clientData.tree
                .map((category) => ({
                    label   : category.title,
                    value   : category.id.toString(),
                    selected: category.id === this._clientCategory?.id,
                })),
            rows            : [
                ...this._compareComponents,
                ...this._serviceComponents,
            ],
            onVariantChange : (e) => {
                this._clientCategory = this._clientData.tree.find((category) => category.id.toString() === e.value);
                this._render();
            },
            onRename        : (title: string) => {
                this._targetCategory.title = title;
            },
        });

        this._revalidate();
        this._header.insert(this.element, 'beforeend');
    }

    private _revalidate () {
        if (this._clientCategory === undefined) {
            this._header?.setValidationType(CompareType.NO_EXIST);
        } else if (!this.isValid) {
            this._header?.setValidationType(CompareType.NO_VALID);
        } else {
            this._header?.setValidationType(CompareType.VALID);
        }
    }
}