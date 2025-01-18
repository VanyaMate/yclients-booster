import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import {
    GOOD_HEADER_TYPE,
} from '@/widget/header-types.ts';


export type GoodDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class GoodDropdownActions extends DropdownActionsButton {
    constructor (props: GoodDropdownActionsProps) {
        super({
            buttonProps  : {
                textContent: 'Действия с товарами',
            },
            compareEntity: props.compareEntity,
            headerType   : GOOD_HEADER_TYPE,
        });
    }
}