import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { DropdownHideEvent } from '@/shared/dropdown/Dropdown/Dropdown.ts';


export type DropdownBoxItemProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        content: Component<HTMLElement>,
        hideOnClick?: boolean;
    };

export class DropdownBoxItem extends Component<HTMLDivElement> {
    constructor (props: DropdownBoxItemProps) {
        const { content, hideOnClick = true, ...other } = props;
        super('div', other, [ content ]);
        if (hideOnClick) {
            this.element.addEventListener('click', () => {
                this.element.dispatchEvent(DropdownHideEvent);
            });
        }
    }
}