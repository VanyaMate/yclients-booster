import { Toggle, ToggleProps } from '@/shared/input/Toggle/Toggle.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export class CompareToggleValue extends Toggle implements ICompareValue<boolean> {
    constructor (props: ToggleProps) {
        super(props);

        this.element.addEventListener('change', () => this.element.dispatchEvent(CompareEvent));
    }
}