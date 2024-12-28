import {
    SETTINGS_SERVICE_CATEGORY_HEADER_TYPE,
} from '@/widget/header-types.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';


export type SettingsServiceCategoryDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class SettingsServiceCategoryDropdownActions extends DropdownActionsButton {
    constructor (props: SettingsServiceCategoryDropdownActionsProps) {
        super({
            buttonProps  : {
                textContent: 'Действия с категориями',
            },
            compareEntity: props.compareEntity,
            headerType   : SETTINGS_SERVICE_CATEGORY_HEADER_TYPE,
        });
    }
}