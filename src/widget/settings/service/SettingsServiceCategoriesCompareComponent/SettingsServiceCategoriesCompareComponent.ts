import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';


export type SettingsServiceCategoriesCompareComponentProps =
    CompareComponentProps
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

export class SettingsServiceCategoriesCompareComponent extends CompareComponent<Array<SettingsServiceCategoryDataWithChildren>> {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _targetData: SettingsServiceCopyData;
    private readonly _bearer: string;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private _compareComponents: Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>> = [];

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
        super(other);
        this._clientId   = clientId;
        this._clientData = clientData;
        this._targetData = targetData;
        this._bearer     = bearer;
        this._fetcher    = fetcher;
        this._logger     = logger;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<SettingsServiceCategoryDataWithChildren>> {
        return this._compareComponents;
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

    protected _action (): Promise<Array<SettingsServiceCategoryDataWithChildren> | null> {
        return new PromiseSplitter(2, 5).exec(
            this._compareComponents.map((component) => ({ chain: [ component.getAction() ] })),
        );
    }

    protected _render () {
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
                    splitterLimit  : 3,
                    splitterRetry  : 3,
                })
            )),
        })
            .insert(this.element, 'afterbegin');
    }
}