import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import { CompareType, ICompareEntity } from '@/entity/compare/Compare.types.ts';


export type ToggleCompareTypeButtonProps =
    ButtonProps
    & {
        container: ICompareEntity<any>;
        headerType: string;
        compareType: CompareType;
        withCurrentHeader?: boolean;
    };

export class ToggleCompareTypeButton extends Button {
    constructor (props: ToggleCompareTypeButtonProps) {
        const {
                  container,
                  headerType,
                  compareType,
                  withCurrentHeader,
                  ...other
              } = props;
        super(other);
        this.element.addEventListener('click', () => this._handler(container, headerType, compareType, withCurrentHeader));
    }

    private _handler (container: ICompareEntity<any>, headerType: string, compareType: CompareType, withCurrentHeader: boolean = true) {
        const header = container.getHeader();

        if (header && withCurrentHeader) {
            if (header.getType() === headerType) {
                header.setCompareType(compareType);
                return;
            }
        }

        container.getChildren().forEach((child) => this._handler(child, headerType, compareType));
    }
}