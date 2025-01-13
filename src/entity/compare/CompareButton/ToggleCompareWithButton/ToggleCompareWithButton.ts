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
        withCurrentHeader?: boolean;
    };

export class ToggleCompareWithButton extends Button {
    constructor (props: ToggleCompareWithButtonProps) {
        const {
                  container,
                  headerType,
                  compareWith,
                  withCurrentHeader,
                  ...other
              } = props;
        super(other);
        this.element.addEventListener('click', () => this._handler(container, headerType, compareWith, withCurrentHeader));
    }

    private _handler (container: ICompareEntity<any>, headerType: string, compareWith: CompareWith, withCurrentHeader: boolean = true) {
        const header = container.getHeader();

        if (header && withCurrentHeader) {
            if (header.getType() === headerType) {
                header.setCompareWith(compareWith);
                return;
            }
        }

        container.getChildren().forEach((child) => this._handler(child, headerType, compareWith));
    }
}