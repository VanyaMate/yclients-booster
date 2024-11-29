import { ICompareComponent } from '@/entity/compare/v3/Compare.types.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import commonCss
    from '@/entity/compare/v3/CompareRowV3/CompareRowV3.module.css';
import {
    TextInput,
    TextInputType,
} from '@/shared/input/TextInput/TextInput.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';
import css from './CompareTextInputRowV3.module.css';


export type CompareTextInputRowV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetData: string;
        clientData?: string;
        label: string;
        type?: TextInputType;
    }

export class CompareTextInputRowV3 extends Component<HTMLDivElement> implements ICompareComponent {
    private _isValid: boolean;
    private _clientValue?: string;
    private _initialTargetValue: string;
    private _currentTargetValue?: string;

    constructor (props: CompareTextInputRowV3Props) {
        const { clientData, targetData, label, type, ...other } = props;
        const isClientEmpty                                     = clientData
                                                                  ? (clientData?.length === 0)
                                                                  : true;
        let textInput: TextInput;
        super('div', other, [
            new Component<HTMLDivElement>('div', {}, [
                textInput = new TextInput({
                    type       : type ?? 'text',
                    value      : targetData,
                    oninput    : () => {
                        this._currentTargetValue = textInput.getValue();
                        this._revalidate();
                    },
                    placeholder: 'Пусто',
                    className  : css.input,
                }),
            ]),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {
                textContent: isClientEmpty ? 'Пусто' : clientData,
                className  : isClientEmpty ? commonCss.empty : '',
            }),
        ]);
        this._initialTargetValue = this._currentTargetValue = targetData;
        this._clientValue        = clientData;
        this._isValid            = this._initialTargetValue === this._clientValue;

        this.element.classList.add(commonCss.container);
        this._revalidate();
    }

    get isValid () {
        return this._isValid;
    }

    private _revalidate () {
        this._isValid = this._clientValue === this._currentTargetValue;
        this.element.dispatchEvent(CompareEvent);

        if (!this._isValid) {
            this.element.classList.add(commonCss.invalid);
        } else {
            this.element.classList.remove(commonCss.invalid);
        }
    }
}