import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.interface.ts';
import css from './CompareHeaderV3.module.css';
import { Select, SelectOption } from '@/shared/input/Select/Select.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    CompareResult,
    CompareType,
    ICompareComponentV3,
} from '@/entity/compare/v3/Compare.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Details } from '@/shared/box/Details/Details.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';


export type CompareHeaderV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetHeaderData: string;
        clientHeaderData?: string;
        label: string;
        rows: Array<ICompareComponentV3>;
        variants: Array<SelectOption>;
        onVariantChange: (option: SelectOption) => void;
        onActivateAll?: () => void;
        onActivateOnlyChildren?: () => void;
        onActivateOnlyItem?: () => void;
        onDeactivate?: () => void;
        onRename?: (name: string) => void;
    };

export class CompareHeaderV3 extends Component<HTMLDivElement> implements ICompareHeaderV3,
                                                                          ICompareComponentV3 {
    private readonly _initialTargetHeader: string;
    private readonly _selectButton: Select;
    private _currentTargetHeader: string;
    private _isValid: boolean;
    private _validating: boolean = true;

    constructor (props: CompareHeaderV3Props) {
        const {
                  targetHeaderData,
                  label,
                  clientHeaderData,
                  onActivateOnlyChildren,
                  onActivateOnlyItem,
                  onActivateAll,
                  onDeactivate,
                  variants,
                  onVariantChange,
                  onRename,
                  rows,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._initialTargetHeader = this._currentTargetHeader = targetHeaderData;
        this._isValid             = this._initialTargetHeader === clientHeaderData;

        this._selectButton = new Select({
            defaultValue    : CompareType.ALL,
            defaultLabel    : 'Все',
            defaultShowLabel: '✓',
            list            : [
                {
                    label    : 'Только это',
                    showLabel: '→',
                    value    : CompareType.ITEM,
                },
                {
                    label    : 'Только дочерние',
                    showLabel: '↓',
                    value    : CompareType.CHILDREN,
                },
                {
                    label    : 'Ничего не делать',
                    showLabel: '🗙',
                    value    : CompareType.NONE,
                },
            ],
            onChange        : (data) => {
                switch (data.value as CompareType) {
                    case CompareType.ALL:
                        return onActivateAll?.();
                    case CompareType.ITEM:
                        return onActivateOnlyItem?.();
                    case CompareType.CHILDREN:
                        return onActivateOnlyChildren?.();
                    case CompareType.NONE:
                        return onDeactivate?.();
                    default:
                        break;
                }
            },
            isModal         : true,
            modalLabel      : `Варианты действия`,
            className       : css.select,
            showValue       : false,
        });

        this._selectButton.insert(this.element, 'beforeend');
        let input: TextInput;

        const content = new Details({
            className: css.content,
            header   : new Component<HTMLDivElement>('div', { className: css.data }, [
                input = new TextInput({
                    type       : 'text',
                    value      : targetHeaderData,
                    placeholder: label,
                    required   : true,
                    oninput    : () => {
                        this._currentTargetHeader = input.getValue();
                        onRename?.(this._currentTargetHeader);
                        this._updateValidation(clientHeaderData);
                    },
                }),
                new Component<HTMLDivElement>('div', { textContent: label }),
                new Component<HTMLDivElement>('div', {}, [
                    new Select({
                        defaultValue: '0',
                        defaultLabel: 'Создать новый',
                        list        : variants,
                        isModal     : true,
                        modalLabel  : `Выберите ${ label }`,
                        showValue   : false,
                        className   : css.headerSelect,
                        onChange    : onVariantChange,
                        withSearch  : true,
                    }),
                ]),
            ]),
            details  : new Col({
                rows     : rows.length
                           ? rows
                           : [ new Component<HTMLDivElement>('div', { textContent: 'Ничего нет' }) ],
                className: css.rows,
            }),
        });

        content.insert(this.element, 'beforeend');
        this._updateValidation(clientHeaderData);
    }

    get isValid (): boolean {
        if (this._validating) {
            return this._isValid;
        }

        return true;
    }

    enable (status: boolean): void {
        this._validating = status;

        if (status) {
            this.element.classList.remove(css.disable);
        } else {
            this.element.classList.add(css.disable);
        }
    }

    setValidationType (type: CompareResult): void {
        switch (type) {
            case CompareResult.VALID:
                this._selectButton.setStyleType(ButtonStyleType.DEFAULT);
                break;
            case CompareResult.NO_VALID:
                this._selectButton.setStyleType(ButtonStyleType.WARNING);
                break;
            case CompareResult.NO_EXIST:
                this._selectButton.setStyleType(ButtonStyleType.DANGER);
                break;
            default:
                break;
        }
    }

    private _updateValidation (headerCompare?: string) {
        if (typeof headerCompare !== 'string') {
            this._selectButton.setStyleType(ButtonStyleType.DANGER);
            this.element.classList.add(css.invalid);
            this._isValid = false;
        } else if (headerCompare !== this._currentTargetHeader) {
            this._selectButton.setStyleType(ButtonStyleType.WARNING);
            this.element.classList.add(css.invalid);
            this._isValid = false;
        } else {
            this._selectButton.setStyleType(ButtonStyleType.DEFAULT);
            this.element.classList.remove(css.invalid);
            this._isValid = true;
        }
        this.element.dispatchEvent(CompareEvent);
    }
}