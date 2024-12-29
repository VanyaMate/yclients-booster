import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable.ts';
import { Select, SelectVariantType } from '@/shared/input/Select/Select.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import css from './CompareTimeSelectsValue.module.css';


export type CompareTimeSelectsValueType = [ number, number ];

export type CompareTimeSelectsValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value: CompareTimeSelectsValueType;
        onChange?: (value: CompareTimeSelectsValueType) => void;
    };

export class CompareTimeSelectsValue extends Component<HTMLDivElement> implements ICompareValue<CompareTimeSelectsValueType> {
    private readonly _currentValue: CompareTimeSelectsValueType;

    constructor (props: CompareTimeSelectsValueProps) {
        const { value, onChange, ...other } = props;

        let hour: number = 0;
        super('div', other, [
            new Select({
                defaultLabel: '0 ч',
                defaultValue: '0',
                list        : new Array(23).fill(0).map((_, index) => {
                    hour = index + 1;
                    return {
                        value   : hour.toString(),
                        label   : `${ hour } ч`,
                        selected: value[0] === hour,
                    };
                }),
                onChange    : (variant) => {
                    this._currentValue[0] = Number(variant.value);
                    onChange?.(this._currentValue);
                    this.element.dispatchEvent(CompareEvent);
                },
                showValue   : false,
                variant     : SelectVariantType.MINIMAL,
            }),
            new Select({
                defaultLabel: '0 м',
                defaultValue: '0',
                onChange    : (variant) => {
                    this._currentValue[1] = Number(variant.value);
                    onChange?.(this._currentValue);
                    this.element.dispatchEvent(CompareEvent);
                },
                variant     : SelectVariantType.MINIMAL,
                showValue   : false,
                list        : [
                    {
                        label   : '5 м',
                        value   : '5',
                        selected: value[1] === 5,
                    },
                    {
                        label   : '10 м',
                        value   : '10',
                        selected: value[1] === 10,
                    },
                    {
                        label   : '15 м',
                        value   : '15',
                        selected: value[1] === 15,
                    },
                    {
                        label   : '20 м',
                        value   : '20',
                        selected: value[1] === 20,
                    },
                    {
                        label   : '25 м',
                        value   : '25',
                        selected: value[1] === 25,
                    },
                    {
                        label   : '30 м',
                        value   : '30',
                        selected: value[1] === 30,
                    },
                    {
                        label   : '35 м',
                        value   : '35',
                        selected: value[1] === 35,
                    },
                    {
                        label   : '40 м',
                        value   : '40',
                        selected: value[1] === 40,
                    },
                    {
                        label   : '45 м',
                        value   : '45',
                        selected: value[1] === 45,
                    },
                    {
                        label   : '50 м',
                        value   : '50',
                        selected: value[1] === 50,
                    },
                    {
                        label   : '55 м',
                        value   : '55',
                        selected: value[1] === 55,
                    },
                ],
            }),
        ]);
        this.element.classList.add(css.container);
        this._currentValue = value;
    }

    getValue (): Nullable<CompareTimeSelectsValueType> {
        return this._currentValue;
    }
}