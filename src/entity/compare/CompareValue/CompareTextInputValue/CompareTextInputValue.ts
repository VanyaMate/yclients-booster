import {
    TextInput,
    TextInputProps,
} from '@/shared/input/TextInput/TextInput.ts';
import css from './CompareTextInputValue.module.css';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export class CompareTextInputValue extends TextInput implements ICompareValue<string> {
    constructor (props: TextInputProps) {
        super(props);

        this.element.placeholder = 'Пусто';
        this.element.classList.add(css.container);
        this.element.addEventListener('input', () => {
            this.element.dispatchEvent(CompareEvent);
        });
    }
}