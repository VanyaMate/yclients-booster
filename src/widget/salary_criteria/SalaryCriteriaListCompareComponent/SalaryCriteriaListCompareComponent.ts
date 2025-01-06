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


export type SalaryCriteriaListCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCopyData: SalaryCriteriaListDataForCopy;
        clientCopyData: SalaryCriteriaListDataForCopy;
    };

export class SalaryCriteriaListCompareComponent extends CompareComponent<Array<SalaryCriteriaFullData>> {
    private readonly _targetCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;

    constructor (props: SalaryCriteriaListCompareComponentProps) {
        const {
                  clientId, targetCopyData, clientCopyData, bearer, ...other
              } = props;
        super(other);

        this._targetCopyData = targetCopyData;
        this._clientCopyData = clientCopyData;
        this._clientId       = clientId;
        this._bearer         = bearer;

        this._render();
    }

    protected async _action (): Promise<SalaryCriteriaFullData[] | null> {
        return null;
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        new Col({
            rows: this._compareChildren = this._targetCopyData.criteriaList.map((criteria) => (
                new SalaryCriteriaCompareComponent({
                    clientId          : this._clientId,
                    bearer            : this._bearer,
                    targetCriteria    : criteria,
                    targetSettingsData: this._targetCopyData.settingsCopyData,
                    clientCopyData    : this._clientCopyData,
                })
            )),
        })
            .insert(this.element, 'afterbegin');
    }
}