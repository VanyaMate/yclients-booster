import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareComponentV3,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';


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

export class SettingsServiceCategoriesCompareComponent extends Component<HTMLDivElement> implements ICompareComponentV3 {
    private _clientId: string;
    private _clientData: SettingsServiceCopyData;
    private _targetData: SettingsServiceCopyData;
    private _bearer: string;
    private _fetcher?: IFetcher;
    private _logger?: ILogger;
    private _enabled: boolean = true;

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

    private _render () {
        this.element.innerHTML = ``;

        const rows = this._targetData.tree.map((category) => (
            new SettingsServiceCategoryCompareComponent({
                targetCategory: category,
                clientId      : this._clientId,
                clientData    : this._clientData,
                bearer        : this._bearer,
                fetcher       : this._fetcher,
                logger        : this._logger,
            })
        ));

        new Col({ rows }).insert(this.element, 'beforeend');
        new Button({
            textContent: 'Получить',
            onclick    : () => {
                const actions = rows.map((row) => row.getAction());
                Promise.all(actions.map((action) => action()));
            },
        }).insert(this.element, 'beforeend');
    }
}