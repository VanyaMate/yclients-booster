import { Select, SelectProps } from '@/shared/input/Select/Select.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export class CompareSelectValue<ValueType> extends Select<ValueType> implements ICompareValue<ValueType> {
    constructor (props: SelectProps<ValueType>) {
        super(props);

        this.onChange(() => {
            this.element.dispatchEvent(CompareEvent);
        });
    }
}