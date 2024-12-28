import {
    DropdownActionsButton,
} from '@/entity/compare/CompareButton/DropdownActionsButton/DropdownActionsButton.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import {
    RESOURCE_INSTANCE_HEADER_TYPE,
} from '@/widget/header-types.ts';


export type ResourceInstanceDropdownActionsProps = {
    compareEntity: ICompareEntity<any>;
}

export class ResourceInstanceDropdownActions extends DropdownActionsButton {
    constructor (props: ResourceInstanceDropdownActionsProps) {
        super({
            buttonProps  : {
                textContent: 'Действия с экземплярами ресурсов',
            },
            compareEntity: props.compareEntity,
            headerType   : RESOURCE_INSTANCE_HEADER_TYPE,
        });
    }
}