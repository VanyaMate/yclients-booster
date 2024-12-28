import {
    ToggleCompareTypeButton,
    ToggleCompareTypeButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareTypeButton/ToggleCompareTypeButton.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type  ToggleCompareToAllButtonProps = Omit<ToggleCompareTypeButtonProps, 'textContent' | 'compareType' | 'styleType' | 'noWrap' | 'fullWidth'>;

export class ToggleCompareToAllButton extends ToggleCompareTypeButton {
    constructor (props: ToggleCompareToAllButtonProps) {
        super({
            ...props,
            textContent: 'Включить все',
            compareType: CompareType.ALL,
            styleType  : ButtonStyleType.DEFAULT,
            noWrap     : true,
            fullWidth  : true,
        });
    }
}