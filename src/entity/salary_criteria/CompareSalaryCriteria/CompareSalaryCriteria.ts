import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SalaryCriteriaFullData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import css from './CompareSalaryCriteria.module.css';
import {
    CompareHeader,
    CompareState,
} from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    CompareSalaryCriteriaRules,
} from '@/entity/salary_criteria/CompareSalaryCriteriaRules/CompareSalaryCriteriaRules.ts';
import { Details, DetailsType } from '@/shared/box/Details/Details.ts';
import {
    salaryCriteriaPeriodTypeTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaPeriodTypeTransform.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    CompareProcess,
} from '@/entity/compare/CompareProcess/CompareProcess.ts';
import {
    CompareStateIconType,
} from '@/entity/compare/CompareStateIcon/CompareStateIcon.ts';
import {
    ICompareComponent,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';


export type compareSalaryCriteriaOnChangeHandler = (id: string) => void;

export type CompareSalaryCriteriaProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataFrom: SalaryCriteriaFullData;
        dataToList: Array<SalaryCriteriaFullData>;
        copyData: SettingsServiceCopyData;
        existedData: SettingsServiceCopyData;
        dataTo?: SalaryCriteriaFullData;
        onChange?: compareSalaryCriteriaOnChangeHandler;
    };

export class CompareSalaryCriteria extends Component<HTMLDivElement> implements ICompareComponent<HTMLDivElement> {
    private readonly _dataFrom: SalaryCriteriaFullData;
    private readonly _dataToList: Array<SalaryCriteriaFullData>;
    private readonly _onChange?: compareSalaryCriteriaOnChangeHandler;
    private readonly _copyData: SettingsServiceCopyData;
    private readonly _existedData: SettingsServiceCopyData;
    private _compareProcess: CompareProcess | null        = null;
    private _rules: Array<ICompareComponent<HTMLElement>> = [];

    constructor (props: CompareSalaryCriteriaProps) {
        const {
                  dataTo,
                  dataFrom,
                  dataToList,
                  onChange,
                  copyData,
                  existedData,
                  ...other
              } = props;
        super('div', other);
        this._dataFrom    = dataFrom;
        this._dataToList  = dataToList;
        this._onChange    = onChange;
        this._copyData    = copyData;
        this._existedData = existedData;
        this.renderWithNewDataTo(dataTo);
        this.element.classList.add(css.container);
    }

    renderWithNewDataTo (data?: SalaryCriteriaFullData | null) {
        if (this._compareProcess) {
            this._compareProcess.remove();
        }

        const row = new CompareRow({
            valueFrom: salaryCriteriaPeriodTypeTransform(this._dataFrom.period)!,
            valueTo  : salaryCriteriaPeriodTypeTransform(data?.period),
            label    : 'Период',
        });

        this._rules = this._dataFrom.rules.map((rule, index) => (
            new CompareSalaryCriteriaRules({
                ruleFrom   : rule,
                ruleTo     : data?.rules[index],
                index      : index,
                copyData   : this._copyData,
                existedData: this._existedData,
            })
        ));

        this._rules.unshift(row);

        const rulesCol = new Col({
            rows: this._rules,
        });

        const header = new CompareHeader({
            titleFrom      : this._dataFrom.title,
            titleTo        : data?.title,
            idTo           : data?.id,
            variants       : this._dataToList.map((item) => ({
                id   : item.id,
                title: item.title,
            })),
            onVariantChange: this._onChange,
            forceState     : this.getValid()
                             ? CompareState.VALID
                             : CompareState.WARNING,
            modalLabel     : 'Выберите критерий',
            label          : 'Критерий',
        });


        this._compareProcess = new CompareProcess({
            init   : this.getValid() ? CompareStateIconType.SUCCESS
                                     : CompareStateIconType.IDLE,
            content: new Details({
                header : header,
                details: new Col({
                    rows: [
                        row,
                        rulesCol,
                    ],
                }),
                type   : DetailsType.SECOND,
            }),
        });
        this._compareProcess.insert(this.element, 'beforeend');
    }

    getValid (): boolean {
        return this._rules.every((item) => item.getValid());
    }
}