import {
    ToggleCompareTypeButton,
    ToggleCompareTypeButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareTypeButton/ToggleCompareTypeButton.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type ToggleCompareToOnlyItemButtonProps = Omit<ToggleCompareTypeButtonProps, 'textContent' | 'compareType' | 'styleType' | 'noWrap' | 'fullWidth'>;

export class ToggleCompareToOnlyItemButton extends ToggleCompareTypeButton {
    constructor (props: ToggleCompareToOnlyItemButtonProps) {
        super({
            ...props,
            textContent: 'Отключить дочерние',
            compareType: CompareType.ITEM,
            styleType  : ButtonStyleType.WARNING,
            noWrap     : true,
            fullWidth  : true,
        });
    }
}