import {
    ToggleCompareTypeButton,
    ToggleCompareTypeButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareTypeButton/ToggleCompareTypeButton.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type  ToggleCompareToDisableProps = Omit<ToggleCompareTypeButtonProps, 'textContent' | 'compareType' | 'styleType' | 'noWrap' | 'fullWidth'>;

export class ToggleCompareToDisableButton extends ToggleCompareTypeButton {
    constructor (props: ToggleCompareToDisableProps) {
        super({
            ...props,
            textContent: 'Отключить все',
            compareType: CompareType.NONE,
            styleType  : ButtonStyleType.WARNING,
            noWrap     : true,
            fullWidth  : true,
        });
    }
}