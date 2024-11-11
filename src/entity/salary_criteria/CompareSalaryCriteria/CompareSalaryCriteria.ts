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
import { Details } from '@/shared/box/Details/Details.ts';


export type onChangeHandler = (id: string) => void;

export type CompareSalaryCriteriaProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataFrom: SalaryCriteriaFullData;
        dataToList: Array<SalaryCriteriaFullData>;
        dataTo?: SalaryCriteriaFullData;
        onChange?: onChangeHandler;
    };

export class CompareSalaryCriteria extends Component<HTMLDivElement> {
    private readonly _dataFrom: SalaryCriteriaFullData;
    private readonly _dataToList: Array<SalaryCriteriaFullData>;
    private readonly _onChange?: onChangeHandler;
    private _col: Details | null = null;

    constructor (props: CompareSalaryCriteriaProps) {
        const { dataTo, dataFrom, dataToList, onChange, ...other } = props;
        super('div', other);
        this._dataFrom   = dataFrom;
        this._dataToList = dataToList;
        this._onChange   = onChange;
        this.renderWithNewDataTo(dataTo);
        this.element.classList.add(css.container);
    }

    renderWithNewDataTo (data?: SalaryCriteriaFullData | null) {
        if (this._col) {
            this._col.remove();
        }

        const row = new CompareRow({
            valueFrom: this._dataFrom.period,
            valueTo  : data?.period,
            label    : 'Период',
        });

        const rules = this._dataFrom.rules.map((rule, index) => (
            new CompareSalaryCriteriaRules({
                ruleFrom: rule,
                ruleTo  : data?.rules[index],
                index   : index,
            })
        ));

        const rulesCol = new Col({
            rows: rules,
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
            forceState     : [ row, ...rules ].every((item) => item.getValid())
                             ? CompareState.VALID
                             : CompareState.WARNING,
        });

        this._col = new Details({
            header : header,
            details: new Col({
                rows: [
                    row,
                    rulesCol,
                ],
            }),
        });
        this._col.insert(this.element, 'beforeend');
    }
}