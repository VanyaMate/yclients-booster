import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import {
    ICompareComponent,
    ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
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
        validationMethod?: CompareRowValidationMethod<Nullable<TargetValue>, Nullable<ClientValue>>;
        validate?: boolean;
        disable?: boolean;
        alignTop?: boolean;
        parent?: ICompareEntity<any>;
        revalidateOnCheck?: boolean;
    };

export class CompareRow<TargetValue, ClientValue> extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _validationMethod?: CompareRowValidationMethod<Nullable<TargetValue>, Nullable<ClientValue>>;
    private readonly _targetValue: ICompareValue<Nullable<TargetValue>>;
    private readonly _clientValue: ICompareValue<Nullable<ClientValue>>;
    private readonly _validating: boolean        = true;
    private readonly _revalidateOnCheck: boolean = false;
    private _enabled: boolean                    = true;
    private _parent?: ICompareEntity<any>;
    private _isValid: boolean                    = false;

    constructor (props: CompareRowV4Props<TargetValue, ClientValue>) {
        const {
                  targetValue,
                  clientValue,
                  label,
                  validationMethod,
                  validate          = true,
                  disable           = false,
                  alignTop          = false,
                  revalidateOnCheck = false,
                  parent,
                  ...other
              } = props;
        super('div', other, [
            new Component<HTMLDivElement>('div', {}, [ targetValue ]),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {}, [ clientValue ]),
        ]);

        this._revalidateOnCheck = revalidateOnCheck;
        this._parent            = parent;
        this._validating        = validate;
        this._targetValue       = targetValue;
        this._clientValue       = clientValue;
        this._validationMethod  = validationMethod;
        this.element.classList.add(css.container);
        this.element.addEventListener(CompareEvent.type, this._revalidateWithParents.bind(this));
        this.enable(!disable);
        this._revalidateWithParents();

        if (alignTop) {
            this.element.classList.add(css.alignTop);
        }
    }

    get isValid (): boolean {
        if (this._revalidateOnCheck) {
            this._validate();
        }

        return this._isValid;
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disabled);
        } else {
            this.element.classList.add(css.disabled);
        }
    }

    private _revalidate (): boolean {
        if (this._enabled && this._validating) {
            if (this._validationMethod) {
                return this._validationMethod(this._targetValue.getValue(), this._clientValue.getValue());
            }

            return this._targetValue.getValue() === this._clientValue.getValue();
        }

        return true;
    }

    private _validate () {
        this._isValid = this._revalidate();

        if (this._isValid) {
            console.log('Revalidate to Invalid');
            this.element.classList.remove(css.invalid);
        } else {
            console.log('Revalidate to Valid');
            this.element.classList.add(css.invalid);
        }
    }

    private _revalidateWithParents () {
        this._validate();
        this._parent?.revalidateWithParents();
    }
}