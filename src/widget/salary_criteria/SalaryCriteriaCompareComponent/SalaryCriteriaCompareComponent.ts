import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { ICompareComponent } from '@/entity/compare/v3/Compare.types.ts';
import {
    SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';


export type SalaryCriteriaCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataOriginal: SalaryCriteriaListDataForCopy;
        dataCompare: SalaryCriteriaListDataForCopy;
        clientId: string;
    };

export class SalaryCriteriaCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    constructor (props: SalaryCriteriaCompareComponentProps) {
        const { ...other } = props;
        super('div', other);
    }

    get isValid () {
        return true;
    }
}