import {
    Component, ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SalaryCriteriaFullData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import css from './CompareSalaryCriteria.module.css';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';


export type CompareSalaryCriteriaProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataFrom: SalaryCriteriaFullData;
        dataTo?: SalaryCriteriaFullData;
    };

export class CompareSalaryCriteria extends Component<HTMLDivElement> {
    constructor (props: CompareSalaryCriteriaProps) {
        const { dataTo, dataFrom, ...other } = props;
        super('div', other, [
            new CompareHeader({
                titleFrom: dataFrom.title,
                titleTo  : dataTo?.title,
                variants : [ 'Вариант 2', 'Вариант 3' ],
            }),
            new CompareRow({
                valueFrom: dataFrom.period,
                valueTo  : dataTo?.period,
                label    : 'Период',
            }),
        ]);
        this.element.classList.add(css.container);
    }
}