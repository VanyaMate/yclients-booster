import {
    ToggleCompareTypeButton,
    ToggleCompareTypeButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareTypeButton/ToggleCompareTypeButton.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type  ToggleCompareToOnlyChildrenProps = Omit<ToggleCompareTypeButtonProps, 'textContent' | 'compareType' | 'styleType' | 'noWrap' | 'fullWidth'>;

export class ToggleCompareToOnlyChildrenButton extends ToggleCompareTypeButton {
    constructor (props: ToggleCompareToOnlyChildrenProps) {
        super({
            ...props,
            textContent: 'Включить только дочерние',
            compareType: CompareType.CHILDREN,
            styleType  : ButtonStyleType.WARNING,
            noWrap     : true,
            fullWidth  : true,
        });
    }
}