import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import {
    CompareWith,
    ICompareEntity,
} from '@/entity/compare/Compare.types.ts';


export type ToggleCompareWithButtonProps =
    ButtonProps
    & {
        container: ICompareEntity<any>;
        headerType: string;
        compareWith: CompareWith;
    };

export class ToggleCompareWithButton extends Button {
    constructor (props: ToggleCompareWithButtonProps) {
        const { container, headerType, compareWith, ...other } = props;
        super(other);
        this.element.addEventListener('click', () => this._handler(container, headerType, compareWith));
    }

    private _handler (container: ICompareEntity<any>, headerType: string, compareWith: CompareWith) {
        const header = container.getHeader();

        if (header) {
            if (header.getType() === headerType) {
                header.setCompareWith(compareWith);
                return;
            }
        }

        container.getChildren().forEach((child) => this._handler(child, headerType, compareWith));
    }
}