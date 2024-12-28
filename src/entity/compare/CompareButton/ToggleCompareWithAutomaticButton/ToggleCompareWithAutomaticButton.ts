import {
    ToggleCompareWithButton,
    ToggleCompareWithButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareWithButton/ToggleCompareWithButton.ts';
import { CompareWith } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type ToggleCompareWithAutomaticButtonProps = Omit<ToggleCompareWithButtonProps, 'textContent' | 'compareWith' | 'styleType' | 'noWrap' | 'fullWidth'>;


export class ToggleCompareWithAutomaticButton extends ToggleCompareWithButton {
    constructor (props: ToggleCompareWithAutomaticButtonProps) {
        super({
            ...props,
            textContent: 'Выбрать автоматически',
            compareWith: CompareWith.CHILDREN,
            noWrap     : true,
            fullWidth  : true,
            styleType  : ButtonStyleType.DEFAULT,
        });
    }
}