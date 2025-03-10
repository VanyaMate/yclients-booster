import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import css from './Select.module.css';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export type SelectOption<ValueType> = {
    selected?: boolean;
    value: ValueType;
    label: string;
    showLabel?: string;
}

export enum SelectVariantType {
    DEFAULT,
    MINIMAL
}

export type SelectOnChange<ValueType> = (data: SelectOption<ValueType>) => void;

export type SelectProps<ValueType> =
    ComponentPropsOptional<HTMLDivElement>
    & {
        defaultValue: ValueType;
        defaultLabel: string;
        defaultShowLabel?: string;
        showDefaultLabel?: boolean;
        list: Array<SelectOption<ValueType>>;
        withSearch?: boolean;
        isModal?: boolean;
        modalLabel?: string;
        showValue?: boolean;
        styleType?: ButtonStyleType;
        onChange?: SelectOnChange<ValueType>;
        variant?: SelectVariantType;
    }

export class Select<ValueType> extends Component<HTMLDivElement> {
    private readonly _defaultLabel: string                               = '';
    private readonly _defaultShowLabel?: string;
    private readonly _defaultValue: ValueType;
    private readonly _defaultStyleType: ButtonStyleType                  = ButtonStyleType.DEFAULT;
    private readonly _showDefaultLabel: boolean                          = true;
    private readonly _onChangeHandler?: SelectOnChange<ValueType>;
    private readonly _isModal: boolean                                   = false;
    private readonly _list: Array<SelectOption<ValueType>>               = [];
    private readonly _selectButton: Button;
    private readonly _dropdown: Col;
    private readonly _optionsBox: Col;
    private readonly _modal: Modal | null                                = null;
    private readonly _onChangeHandlers: Array<SelectOnChange<ValueType>> = [];
    private readonly _currentShowLabel?: string;
    private readonly _showValue: boolean                                 = true;
    private readonly _hideOnDomClickHandler: (event: MouseEvent) => void;
    private readonly _inited: boolean                                    = false;
    private _search: string                                              = '';
    private _currentLabel: string                                        = '';
    private _currentValue: ValueType;

    constructor (props: SelectProps<ValueType>) {
        const {
                  list,
                  withSearch,
                  defaultLabel,
                  defaultValue,
                  defaultShowLabel,
                  showDefaultLabel,
                  styleType,
                  isModal,
                  modalLabel,
                  showValue = true,
                  onChange,
                  className,
                  variant,
                  ...other
              } = props;

        super('div', other);

        this._defaultValue          = this._currentValue = defaultValue;
        this._defaultShowLabel      = this._currentShowLabel = defaultShowLabel;
        this._defaultLabel          = this._currentLabel = defaultLabel;
        this._defaultStyleType      = this._defaultStyleType ?? ButtonStyleType.DEFAULT;
        this._showDefaultLabel      = showDefaultLabel ?? true;
        this._onChangeHandler       = onChange;
        this._isModal               = isModal ?? false;
        this._list                  = list;
        this._showValue             = showValue;
        this._hideOnDomClickHandler = this._hideOnDocumentClick.bind(this);

        this.element.classList.add(css.container);

        if (variant === SelectVariantType.MINIMAL) {
            this.element.classList.add(css.minimal);
        }

        this._selectButton = new Button({
            textContent: this._currentShowLabel ?? this._currentLabel,
            styleType  : this._defaultStyleType,
            fullWidth  : true,
            className  : `${ css.label } ${ className }`,
            onclick    : this._toggle.bind(this),
        });
        this._selectButton.insert(this.element, 'afterbegin');

        this._list.forEach((item) => {
            if (item.selected) {
                this._select(item);
                return;
            }
        });

        this._dropdown = new Col({
            rows     : [],
            className: ([ css.dropdown, isModal ? css.isModal : '' ]).join(' '),
        });

        if (withSearch) {
            const textInput = new TextInput({
                type       : 'text',
                placeholder: 'Поиск по названию',
                className  : css.search,
                oninput    : (event) => {
                    const target: HTMLInputElement = event.target as HTMLInputElement;
                    this._search                   = target.value;
                    this._renderOptions();
                },
            });

            this._dropdown.add(textInput);
        }

        this._optionsBox = new Col({ rows: [] });
        this._dropdown.add(this._optionsBox);

        if (!this._isModal) {
            this._dropdown.insert(this.element, 'beforeend');
        } else {
            this._modal = new Modal({
                label  : modalLabel ?? 'Выбор',
                content: this._dropdown,
            });

            this._modal.onChange((state: boolean) => {
                if (state) {
                    this.show();
                } else {
                    this.hide();
                }
            });
        }

        this._renderOptions();
        this._inited = true;
    }

    getValue () {
        return this._currentValue;
    }

    setValue (value: any) {
        for (let i = 0; i < this._list.length; i++) {
            if (this._list[i].value === value) {
                this._select(this._list[i]);
                return;
            }
        }

        this._selectDefaultValue();
    }

    public setStyleType (styleType: ButtonStyleType) {
        this._selectButton.setStyleType(styleType);
    }

    public get isOpened () {
        return this.element.classList.contains(css.show);
    }

    public show () {
        this.element.classList.add(css.show);
        document.addEventListener('click', this._hideOnDomClickHandler);
    }

    public hide () {
        this.element.classList.remove(css.show);
        document.removeEventListener('click', this._hideOnDomClickHandler);
    }

    public onChange (callback: SelectOnChange<ValueType>) {
        this._onChangeHandlers.push(callback);
    }

    private _renderOptions () {
        this._optionsBox.clear();
        let selected: boolean = this._defaultValue === this._currentValue;
        if (!this._search && this._showDefaultLabel) {
            this._optionsBox.add(
                new Button({
                    textContent: this._defaultLabel,
                    styleType  : selected ? ButtonStyleType.PRIMARY
                                          : undefined,
                    disabled   : selected,
                    fullWidth  : true,
                    onclick    : this._selectDefaultValue.bind(this),
                }),
            );
        }
        this._list
            .filter((item) => item.label.match(new RegExp(this._search, 'gi')) || (typeof item.value === 'string'
                                                                                   ? item.value.match(this._search)
                                                                                   : item.value === this._search))
            .forEach((item) => {
                selected = item.value === this._currentValue;
                this._optionsBox.add(
                    new Button({
                        textContent: this._showValue
                                     ? `${ item.label } (${ item.value })`
                                     : item.label,
                        styleType  : selected ? ButtonStyleType.PRIMARY
                                              : undefined,
                        disabled   : selected,
                        fullWidth  : true,
                        onclick    : () => this._select(item),
                    }),
                );
            });
    }

    private _selectDefaultValue () {
        this._select({
            label    : this._defaultLabel,
            showLabel: this._defaultShowLabel,
            value    : this._defaultValue,
        });
    }

    private _select (item: SelectOption<ValueType>) {
        this._currentValue = item.value;
        this._currentLabel = item.showLabel ?? item.label;

        if (this._isModal) {
            this._modal?.hide();
        }

        this.hide();
        this._selectButton.element.textContent = this._currentLabel;

        if (this._inited) {
            this._onChangeHandler?.(item);
            this._onChangeHandlers.forEach((callback) => callback(item));
        }
    }

    private _toggle () {
        if (this.isOpened) {
            if (this._isModal) {
                this._modal?.hide();
            }

            this.hide();
        } else {
            this._renderOptions();
            if (this._isModal) {
                this._modal?.show();
            }

            this.show();
        }
    }

    private _hideOnDocumentClick (event: MouseEvent) {
        let target: HTMLElement | null = event.target as HTMLElement;

        if (target) {
            while (target) {
                if (target === this.element) {
                    return;
                }

                target = target.parentElement;
            }

            this.hide();
        }
    }
}