import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { ICompareComponent } from '@/entity/compare/Compare.types.ts';


export type SettingsServiceCategoriesCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        // Сохранить / Обновить для этого пользователя
        clientId: string;
        // Текущие данные пользователя
        clientData: SettingsServiceCopyData;
        // Данные для копирования/создания
        targetData: SettingsServiceCopyData;
        // Bearer token для запроса
        bearer: string;
        // IFetcher для запросов
        fetcher?: IFetcher;
        // ILogger для логирования
        logger?: ILogger;
    };

export class SettingsServiceCategoriesCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetData: SettingsServiceCopyData;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _compareComponents: Array<SettingsServiceCategoryCompareComponent> = [];
    private _enabled: boolean                                                  = true;

    constructor (props: SettingsServiceCategoriesCompareComponentProps) {
        const {
                  targetData,
                  clientData,
                  clientId,
                  bearer,
                  fetcher,
                  logger,
                  ...other
              } = props;
        super('div', other);
        this._clientId   = clientId;
        this._clientData = clientData;
        this._targetData = targetData;
        this._bearer     = bearer;
        this._fetcher    = fetcher;
        this._logger     = logger;

        this._render();
    }

    get isValid () {
        if (this._enabled) {
            return true;
        }
        return true;
    }

    enable (status: boolean): void {
        this._enabled = status;
    }

    getActions () {
        return this._compareComponents.map((component) => component.getAction());
    }

    private _render () {
        this.element.innerHTML = ``;

        new Col({
            rows: this._compareComponents = this._targetData.tree.map((category) => (
                new SettingsServiceCategoryCompareComponent({
                    targetCategory : category,
                    clientId       : this._clientId,
                    clientData     : this._clientData,
                    targetResources: this._targetData.resources,
                    bearer         : this._bearer,
                    fetcher        : this._fetcher,
                    logger         : this._logger,
                })
            )),
        })
            .insert(this.element, 'afterbegin');
    }
}