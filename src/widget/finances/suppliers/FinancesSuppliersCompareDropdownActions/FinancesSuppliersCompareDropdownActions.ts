import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { FINANCES_SUPPLIERS_HEADER_TYPE } from '@/widget/header-types.ts';


export type FinancesSuppliersCompareDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}


export class FinancesSuppliersCompareDropdownActions extends DropdownActionsButton {
    constructor (props: FinancesSuppliersCompareDropdownActionsProps) {
        super({
            compareEntity    : props.compareEntity,
            headerType       : FINANCES_SUPPLIERS_HEADER_TYPE,
            buttonProps      : {
                textContent: 'Действия с контрагентами',
            },
            withCurrentHeader: true,
        });
    }
}