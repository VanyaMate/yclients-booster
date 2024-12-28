import { Dropdown } from '@/shared/dropdown/Dropdown/Dropdown.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import {
    DropdownBoxItem,
} from '@/shared/dropdown/Dropdown/DropdownBoxItem/DropdownBoxItem.ts';
import {
    ToggleCompareToAllButton,
} from '@/entity/compare/CompareButton/ToggleCompareToAllButton/ToggleCompareToAllButton.ts';
import {
    ToggleCompareToOnlyItemButton,
} from '@/entity/compare/CompareButton/ToggleCompareToOnlyItemButton/ToggleCompareToOnlyItemButton.ts';
import {
    ToggleCompareToOnlyChildrenButton,
} from '@/entity/compare/CompareButton/ToggleCompareToOnlyChildrenButton/ToggleCompareToOnlyChildrenButton.ts';
import {
    ToggleCompareToDisableButton,
} from '@/entity/compare/CompareButton/ToggleCompareToDisableButton/ToggleCompareToDisableButton.ts';
import { ButtonProps } from '@/shared/buttons/Button/Button.ts';
import {
    ToggleCompareWithNoneButton,
} from '@/entity/compare/CompareButton/ToggleCompareWithNoneButton/ToggleCompareWithNoneButton.ts';
import {
    ToggleCompareWithAutomaticButton,
} from '@/entity/compare/CompareButton/ToggleCompareWithAutomaticButton/ToggleCompareWithAutomaticButton.ts';


export type DropdownActionsButtonProps = {
    compareEntity: ICompareEntity<any>;
    headerType: string;
    buttonProps: ButtonProps;
}

export class DropdownActionsButton extends Dropdown {
    constructor (props: DropdownActionsButtonProps) {
        super({
            buttonProps: props.buttonProps,
            content    : new Col({
                rows: [
                    new LabelDivider({
                        textContent: 'Тип сравнения',
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareToAllButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareToOnlyItemButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareToOnlyChildrenButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareToDisableButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                    new LabelDivider({
                        textContent: 'Сравнивать с чем',
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareWithAutomaticButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                    new DropdownBoxItem({
                        content: new ToggleCompareWithNoneButton({
                            container : props.compareEntity,
                            headerType: props.headerType,
                        }),
                    }),
                ],
            }),
        });
    }
}