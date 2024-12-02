import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareResult,
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
import { SelectOption } from '@/shared/input/Select/Select.ts';
import { CompareBoxV3 } from '@/entity/compare/v3/CompareBoxV3/CompareBoxV3.ts';


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
    private _categoryCompareRows: Array<ICompareComponent>                 = [];
    private _categoryCompareChildren: Array<ICompareComponent>             = [];
    private _serviceComponents: Array<SettingsServiceItemCompareComponent> = [];
    private _clientCategory?: SettingsServiceCategoryDataWithChildren;
    private _header?: CompareHeaderV3;
    private _bearer: string;
    private _fetcher?: IFetcher;
    private _logger?: ILogger;
    private _enabled: boolean                                              = true;

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
        if (this._enabled) {
            return (
                this._currentCategoryIsValid() &&
                this._childrenIsValid()
            );
        }
        return true;
    }

    enable (status: boolean): void {
        this._enabled = status;
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
                console.log('CREATE NEW CATEGORY FOR', this._clientId);
                return createSettingsServiceCategoryRequestAction(this._bearer, this._clientId, {
                    title        : this._targetCategory.title,
                    service_count: 0,
                    services     : [],
                    translations : this._targetCategory.translations,
                    staff        : [],
                    api_id       : this._targetCategory.api_id,
                    booking_title: this._targetCategory.booking_title ?? this._targetCategory.title,
                }, this._fetcher, this._logger)
                    .then((response) => {
                        console.log(`CATEGORY CREATED ${ response.id }`);
                        this._serviceComponents.map((component) => component.getAction(response.id.toString())());
                    });
            }

            return;
        };
    }

    private _currentCategoryIsValid () {
        return (
            this._clientCategory !== undefined &&
            (this._header?.isValid ?? false) &&
            this._categoryCompareRows.every((component) => component.isValid)
        );
    }

    private _childrenIsValid () {
        return this._serviceComponents.every((component) => component.isValid);
    }

    private _render () {
        this.element.innerHTML        = ``;
        this._categoryCompareChildren = [
            new CompareBoxV3({
                title     : 'Сервисы',
                level     : 3,
                components: this._serviceComponents = this._targetCategory.children.map((service) => (
                    new SettingsServiceItemCompareComponent({
                        clientId      : this._clientId,
                        targetService : service,
                        clientServices: this._clientCategory?.children,
                        bearer        : this._bearer,
                        fetcher       : this._fetcher,
                        logger        : this._logger,
                    })
                )),
            }),
        ];

        this._categoryCompareRows = [
            new CompareBoxV3({
                title     : 'Поля категории',
                level     : 2,
                components: [
                    new CompareRowV3({
                        targetData: this._targetCategory.booking_title,
                        clientData: this._clientCategory?.booking_title,
                        label     : 'Букинг заголовок',
                    }),
                    new CompareRowV3({
                        targetData: this._targetCategory.sex ? 'Муж' : 'Жен',
                        clientData: this._clientCategory?.sex === undefined
                                    ? undefined : this._clientCategory.sex
                                                  ? 'Муж'
                                                  : 'Жен',
                        label     : 'Пол',
                    }),
                    new CompareRowV3({
                        targetData: this._targetCategory.translations.length.toString(),
                        clientData: this._clientCategory?.translations.length.toString(),
                        label     : 'Переводы',
                    }),
                ],
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
                ...this._categoryCompareRows,
                ...this._categoryCompareChildren,
            ],
            onVariantChange : (e: SelectOption) => {
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
            this._header?.setValidationType(CompareResult.NO_EXIST);
        } else if (!this.isValid) {
            this._header?.setValidationType(CompareResult.NO_VALID);
        } else {
            this._header?.setValidationType(CompareResult.VALID);
        }
    }
}