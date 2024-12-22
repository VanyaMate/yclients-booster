import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Select } from '@/shared/input/Select/Select.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import css from './ComparePriceWithSelectValue.module.css';


export enum ComparePriceSelectType {
    RUBLES   = '₽',
    PERCENTS = '%'
}

export type ComparePriceWithSelectValueType = [ string, ComparePriceSelectType ];
export type ComparePriceWithSelectValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: ComparePriceWithSelectValueType;
        onChange?: (value: ComparePriceWithSelectValueType) => void;
    }


export class ComparePriceWithSelectValue extends Component<HTMLDivElement> implements ICompareValue<ComparePriceWithSelectValueType> {
    private readonly _currentValue: ComparePriceWithSelectValueType;

    constructor (props: ComparePriceWithSelectValueProps) {
        const { value, onChange, ...other } = props;
        let input: TextInput;
        super('div', other, [
            input = new TextInput({
                type       : 'number',
                value      : value[0],
                max        : '100',
                min        : '0',
                placeholder: 'Пусто',
                oninput    : () => {
                    this._currentValue[0] = input.getValue();
                    onChange?.(this._currentValue);
                    this.element.dispatchEvent(CompareEvent);
                },
            }),
            new Select({
                defaultValue    : '',
                defaultLabel    : '',
                showDefaultLabel: false,
                showValue       : false,
                list            : [
                    {
                        value    : ComparePriceSelectType.PERCENTS,
                        label    : 'Проценты',
                        showLabel: '%',
                        selected : value[1] === ComparePriceSelectType.PERCENTS,
                    },
                    {
                        value    : ComparePriceSelectType.RUBLES,
                        label    : 'Рубли',
                        showLabel: '₽',
                        selected : value[1] === ComparePriceSelectType.RUBLES,
                    },
                ],
                onChange        : (value) => {
                    this._currentValue[1] = value.value as ComparePriceSelectType;
                    onChange?.(this._currentValue);
                    this.element.dispatchEvent(CompareEvent);
                },
            }),
        ]);
        this._currentValue = value;
        this.element.classList.add(css.container);
    }

    getValue (): Nullable<ComparePriceWithSelectValueType> {
        return this._currentValue;
    }
}