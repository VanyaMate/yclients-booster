import { ComponentPropsOptional } from '@/shared/component/Component.ts';
import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceItemCompareComponent,
} from '@/widget/settings/service/SettingsServiceItemCompareComponent/SettingsServiceItemCompareComponent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    createSettingsServiceCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/createSettingsServiceCategory/createSettingsServiceCategory.request-action.ts';
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

export class SettingsServiceCategoryCompareComponent extends CompareComponent implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetCategory: SettingsServiceCategoryDataWithChildren;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _serviceComponents: Array<SettingsServiceItemCompareComponent> = [];
    private _clientCategory?: SettingsServiceCategoryDataWithChildren;

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
        super(other);

        this._clientId       = clientId;
        this._clientData     = clientData;
        this._targetCategory = targetCategory;
        this._bearer         = bearer;
        this._fetcher        = fetcher;
        this._logger         = logger;
        this._clientCategory = this._clientData.tree.find((category) => category.title === this._targetCategory.title);

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this, this._clientCategory));
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
            this._compareRows.every((component) => component.isValid)
        );
    }

    private _childrenIsValid () {
        return this._serviceComponents.every((component) => component.isValid);
    }

    private _render () {
        this.element.innerHTML = ``;
        this._compareChildren  = [
            new CompareBox({
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

        this._compareRows = [
            new CompareBox({
                title     : 'Поля категории',
                level     : 2,
                components: [],
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
        });

        this._revalidate(this._clientCategory);
        this._header.insert(this.element, 'beforeend');
    }
}