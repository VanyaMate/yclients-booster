import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { RESOURCE_HEADER_TYPE } from '@/widget/header-types.ts';


export type ResourceDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class ResourceDropdownActions extends DropdownActionsButton {
    constructor (props: ResourceDropdownActionsProps) {
        super({
            buttonProps  : {
                textContent: 'Действия с ресурсами',
            },
            compareEntity: props.compareEntity,
            headerType   : RESOURCE_HEADER_TYPE,
        });
    }
}