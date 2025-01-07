import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    SALARY_CRITERIA_HEADER_TYPE,
} from '@/widget/salary_criteria/salary-criteria.header-type.ts';


export type SalaryCriteriaDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class SalaryCriteriaDropdownActions extends DropdownActionsButton {
    constructor (props: SalaryCriteriaDropdownActionsProps) {
        super({
            buttonProps  : {
                styleType  : ButtonStyleType.DEFAULT,
                textContent: 'Действия с критериями ЗП',
            },
            compareEntity: props.compareEntity,
            headerType   : SALARY_CRITERIA_HEADER_TYPE,
        });
    }
}