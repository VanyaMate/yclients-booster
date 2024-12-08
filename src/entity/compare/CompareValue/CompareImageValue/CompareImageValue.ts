import { Image, ImageProps } from '@/shared/image/Image/Image.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';
import css from './CompareImageValue.module.css';


export class CompareImageValue extends Image implements ICompareValue<boolean> {
    private readonly _isNotEmpty: boolean;

    constructor (props: ImageProps) {
        const { src } = props;
        super(props);
        this._isNotEmpty = src !== undefined;
        this.element.classList.add(css.container);
    }

    getValue (): Nullable<boolean> {
        return this._isNotEmpty;
    }
}