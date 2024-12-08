import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { ICompareComponent } from '@/entity/compare/Compare.types.ts';
import css from './CompareRow.module.css';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import { Nullable } from '@/types/Nullable.ts';


export type CompareRowValidationMethod<TargetValue, ClientValue> = (targetValue: TargetValue, clientValue: ClientValue) => boolean;

export type CompareRowV4Props<TargetValue, ClientValue> =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetValue: ICompareValue<Nullable<TargetValue>>;
        clientValue: ICompareValue<Nullable<ClientValue>>;
        label: string;
        validationMethod?: CompareRowValidationMethod<Nullable<TargetValue>, Nullable<ClientValue>>
    };

export class CompareRow<TargetValue, ClientValue> extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _validationMethod?: CompareRowValidationMethod<Nullable<TargetValue>, Nullable<ClientValue>>;
    private readonly _targetValue: ICompareValue<Nullable<TargetValue>>;
    private readonly _clientValue: ICompareValue<Nullable<ClientValue>>;
    private _enabled: boolean = true;

    constructor (props: CompareRowV4Props<TargetValue, ClientValue>) {
        const {
                  targetValue, clientValue, label, validationMethod, ...other
              } = props;
        super('div', other, [
            new Component<HTMLDivElement>('div', {}, [ targetValue ]),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {}, [ clientValue ]),
        ]);

        this._targetValue      = targetValue;
        this._clientValue      = clientValue;
        this._validationMethod = validationMethod;
        this.element.classList.add(css.container);
        this.element.addEventListener(CompareEvent.type, this._validate.bind(this));
        this._validate();
    }

    get isValid (): boolean {
        if (this._enabled) {
            if (this._validationMethod) {
                return this._validationMethod(this._targetValue.getValue(), this._clientValue.getValue());
            }

            return this._targetValue.getValue() === this._clientValue.getValue();
        }

        return true;
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disabled);
        } else {
            this.element.classList.add(css.disabled);
        }
    }

    private _validate () {
        if (this.isValid) {
            this.element.classList.remove(css.invalid);
        } else {
            this.element.classList.add(css.invalid);
        }
    }
}