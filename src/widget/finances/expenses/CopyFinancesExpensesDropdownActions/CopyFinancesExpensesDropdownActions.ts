import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import {
    FINANCES_EXPENSES_HEADER_TYPE,
} from '@/widget/header-types.ts';


export type CopyFinancesExpensesDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class CopyFinancesExpensesDropdownActions extends DropdownActionsButton {
    constructor (props: CopyFinancesExpensesDropdownActionsProps) {
        super({
            compareEntity    : props.compareEntity,
            headerType       : FINANCES_EXPENSES_HEADER_TYPE,
            buttonProps      : {
                textContent: 'Действия с статьями расходов',
            },
            withCurrentHeader: true,
        });
    }
}