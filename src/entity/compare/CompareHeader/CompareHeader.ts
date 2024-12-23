import {
    ICompareHeader,
} from '@/entity/compare/CompareHeader/CompareHeader.interface.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareProcess, CompareResult,
    CompareType,
    ICompareComponent,
} from '@/entity/compare/Compare.types.ts';
import { Select, SelectOption } from '@/shared/input/Select/Select.ts';
import css from './CompareHeader.module.css';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Details } from '@/shared/box/Details/Details.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export type CompareHeaderActivateHandler = () => void;

export type CompareHeaderProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetHeaderData: string;
        clientHeaderData?: string;
        label: string;
        rows: Array<ICompareComponent>;
        variants: Array<SelectOption>;
        onVariantChange: (option: SelectOption) => void;
        onActivateAll?: CompareHeaderActivateHandler;
        onActivateOnlyChildren?: CompareHeaderActivateHandler;
        onActivateOnlyItem?: CompareHeaderActivateHandler;
        onDeactivate?: CompareHeaderActivateHandler;
        onRename?: (name: string) => void;
        disable?: boolean;
    };

export class CompareHeader extends Component<HTMLDivElement> implements ICompareHeader,
                                                                        ICompareComponent {
    private readonly _initialTargetHeader: string;
    private readonly _selectButton: Select;
    private readonly _processButton: Component<HTMLDivElement>;
    private readonly _disableByProp: boolean = false;
    private readonly _onActivateAll?: CompareHeaderActivateHandler;
    private readonly _onActivateOnlyItem?: CompareHeaderActivateHandler;
    private readonly _onActivateOnlyChildren?: CompareHeaderActivateHandler;
    private readonly _onDeactivate?: CompareHeaderActivateHandler;
    private _currentTargetHeader: string;
    private _isValid: boolean;
    private _enabled: boolean                = true;

    constructor (props: CompareHeaderProps) {
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
                  disable = false,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._onActivateAll          = onActivateAll;
        this._onActivateOnlyItem     = onActivateOnlyItem;
        this._onActivateOnlyChildren = onActivateOnlyChildren;
        this._onDeactivate           = onDeactivate;
        this._disableByProp          = disable;
        this._initialTargetHeader    = this._currentTargetHeader = targetHeaderData;
        this._isValid                = this._initialTargetHeader === clientHeaderData;

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
            onChange        : (data) => this.setCompareType(data.value),
            isModal         : true,
            modalLabel      : `Варианты действия`,
            className       : css.select,
            showValue       : false,
        });

        this._selectButton.insert(this.element, 'beforeend');
        this._processButton = new Component<HTMLDivElement>('div', {
            className: css.state,
        });

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
                        showValue   : true,
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
        this.enable(true);
    }

    get isValid (): boolean {
        if (this._enabled) {
            return this._isValid;
        }

        return true;
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status && !this._disableByProp) {
            this.element.classList.remove(css.disable);
        } else {
            this.element.classList.add(css.disable);
        }
    }

    setProcessType (process: CompareProcess) {
        switch (process) {
            case CompareProcess.ERROR:
                this._selectButton.remove();
                this._processButton.insert(this.element, 'afterbegin');
                this._processButton.element.className = `${ css.state } ${ css.error }`;
                this.element.classList.add(css.processAction);
                break;
            case CompareProcess.SUCCESS:
                this._selectButton.remove();
                this._processButton.insert(this.element, 'afterbegin');
                this._processButton.element.className = `${ css.state } ${ css.success }`;
                this.element.classList.add(css.processAction);
                break;
            case CompareProcess.PROCESS:
                this._selectButton.remove();
                this._processButton.insert(this.element, 'afterbegin');
                this._processButton.element.className = `${ css.state } ${ css.process }`;
                this.element.classList.add(css.processAction);
                break;
            case CompareProcess.IDLE:
                this._selectButton.remove();
                this._processButton.insert(this.element, 'afterbegin');
                this._processButton.element.className = `${ css.state } ${ css.idle }`;
                this.element.classList.add(css.processAction);
                break;
            default:
                this._selectButton.insert(this.element, 'afterbegin');
                this._processButton.remove();
                this.element.classList.remove(css.processAction);
                break;
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

    setCompareType (type: CompareType) {
        switch (type as CompareType) {
            case CompareType.ALL:
                return this._onActivateAll?.();
            case CompareType.ITEM:
                return this._onActivateOnlyItem?.();
            case CompareType.CHILDREN:
                return this._onActivateOnlyChildren?.();
            case CompareType.NONE:
                return this._onDeactivate?.();
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