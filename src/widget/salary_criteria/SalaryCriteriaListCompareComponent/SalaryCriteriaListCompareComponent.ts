import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    SalaryCriteriaFullData, SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SalaryCriteriaCompareComponent,
} from '@/widget/salary_criteria/SalaryCriteriaCompareComponent/SalaryCriteriaCompareComponent.ts';
import {
    CompareBoxWithoutValidation,
} from '@/entity/compare/CompareWithoutValidation/CompareBoxWithoutValidation.ts';
import {
    SalaryCriteriaDropdownActions,
} from '@/widget/salary_criteria/SalaryCriteriaDropdownActionts/SalaryCriteriaDropdownActionts.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import {
    SettingsServiceCategoryDropdownActions,
} from '@/widget/settings/service/SettingsServiceCategoryDropdownActions/SettingsServiceCategoryDropdownActions.ts';
import {
    SettingsServiceDropdownActions,
} from '@/widget/settings/service/SettingsServiceDropdownActions/SettingsServiceDropdownActions.ts';
import {
    ResourceDropdownActions,
} from '@/widget/resources/ResourceDropdownActions/ResourceDropdownActions.ts';
import {
    ResourceInstanceDropdownActions,
} from '@/widget/resources/ResourceInstanceDropdownActions/ResourceInstanceDropdownActions.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';


export type SalaryCriteriaListCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCopyData: SalaryCriteriaListDataForCopy;
        clientCopyData: SalaryCriteriaListDataForCopy;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class SalaryCriteriaListCompareComponent extends CompareComponent<Array<SalaryCriteriaFullData>> {
    private readonly _targetCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _criteriaComponent: Array<ICompareEntity<SalaryCriteriaFullData>> = [];

    constructor (props: SalaryCriteriaListCompareComponentProps) {
        const {
                  clientId,
                  targetCopyData,
                  clientCopyData,
                  bearer,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._targetCopyData = targetCopyData;
        this._clientCopyData = clientCopyData;
        this._clientId       = clientId;
        this._bearer         = bearer;
        this._logger         = logger;
        this._fetcher        = fetcher;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<SalaryCriteriaFullData>> {
        return this._criteriaComponent;
    }

    protected async _action (): Promise<SalaryCriteriaFullData[] | null> {
        const splitter = new PromiseSplitter(5, 1);
        return splitter.exec(this.getChildren().map((child) => ({ chain: [ child.getAction() ] })));
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        new Col({
            rows: [
                new CompareBoxWithoutValidation({
                    title     : 'Массовые действия',
                    level     : 2,
                    components: [
                        new Row({
                            cols: [
                                new SalaryCriteriaDropdownActions({ compareEntity: this }),
                                new SettingsServiceCategoryDropdownActions({ compareEntity: this }),
                                new SettingsServiceDropdownActions({ compareEntity: this }),
                                new ResourceDropdownActions({ compareEntity: this }),
                                new ResourceInstanceDropdownActions({ compareEntity: this }),
                            ],
                        }),
                    ],
                }),
                ...this._criteriaComponent = this._targetCopyData.criteriaList.map((criteria) => (
                    new SalaryCriteriaCompareComponent({
                        clientId      : this._clientId,
                        bearer        : this._bearer,
                        targetCriteria: criteria,
                        targetCopyData: this._targetCopyData,
                        clientCopyData: this._clientCopyData,
                        logger        : this._logger,
                        fetcher       : this._fetcher,
                    })
                )),
            ],
        })
            .insert(this.element, 'afterbegin');
    }
}