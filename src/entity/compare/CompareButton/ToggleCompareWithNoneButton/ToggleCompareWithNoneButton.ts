import {
    ToggleCompareWithButton,
    ToggleCompareWithButtonProps,
} from '@/entity/compare/CompareButton/ToggleCompareWithButton/ToggleCompareWithButton.ts';
import { CompareWith } from '@/entity/compare/Compare.types.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type ToggleCompareWithNoneButtonProps = Omit<ToggleCompareWithButtonProps, 'textContent' | 'compareWith' | 'styleType' | 'noWrap' | 'fullWidth'>;


export class ToggleCompareWithNoneButton extends ToggleCompareWithButton {
    constructor (props: ToggleCompareWithNoneButtonProps) {
        super({
            ...props,
            textContent: 'Создать новое',
            compareWith: CompareWith.NONE,
            noWrap     : true,
            fullWidth  : true,
            styleType  : ButtonStyleType.DANGER,
        });
    }
}