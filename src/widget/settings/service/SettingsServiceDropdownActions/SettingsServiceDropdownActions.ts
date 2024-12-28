import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { SETTINGS_SERVICE_ITEM_HEADER_TYPE } from '@/widget/header-types.ts';


export type SettingsServiceDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class SettingsServiceDropdownActions extends DropdownActionsButton {
    constructor (props: SettingsServiceDropdownActionsProps) {
        super({
            buttonProps  : {
                textContent: 'Действия с услугами',
            },
            compareEntity: props.compareEntity,
            headerType   : SETTINGS_SERVICE_ITEM_HEADER_TYPE,
        });
    }
}