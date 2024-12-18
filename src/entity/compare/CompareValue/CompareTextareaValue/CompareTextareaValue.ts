import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import { TextArea, TextAreaProps } from '@/shared/input/TextArea/TextArea.ts';
import css from './CompareTextareaValue.module.css';


export class CompareTextareaValue extends TextArea implements ICompareValue<string> {
    constructor (props: TextAreaProps) {
        super(props);

        this.element.placeholder = 'Пусто';
        this.element.classList.add(css.container);
        this.element.addEventListener('input', () => {
            this.element.dispatchEvent(CompareEvent);
        });
    }
}