import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { GOOD_CATEGORY_HEADER_TYPE } from '@/widget/header-types.ts';


export type GoodCategoryDropdownActionsProps = {
    compareEntity: ICompareEntity<any>
}

export class GoodCategoryDropdownActions extends DropdownActionsButton {
    constructor (props: GoodCategoryDropdownActionsProps) {
        super({
            buttonProps      : {
                textContent: 'Действия с категориями товаров',
            },
            compareEntity    : props.compareEntity,
            headerType       : GOOD_CATEGORY_HEADER_TYPE,
            withCurrentHeader: false,
        });
    }
}