import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import css from './Select.module.css';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type SelectOption = {
    selected?: boolean;
    value: string;
    label: string;
}

export type SelectProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        defaultValue: string;
        defaultLabel: string;
        list: Array<SelectOption>;
        withSearch?: boolean;
        styleType?: ButtonStyleType;
    }

export class Select extends Component<HTMLDivElement> {
    private readonly _defaultLabel: string              = '';
    private readonly _defaultValue: string              = '';
    private readonly _defaultStyleType: ButtonStyleType = ButtonStyleType.DEFAULT;
    private readonly _list: Array<SelectOption>         = [];
    private readonly _selectButton: Button;
    private readonly _dropdown: Col;
    private readonly _optionsBox: Col;
    private _search: string                             = '';
    private _currentLabel: string                       = '';
    private _currentValue: string                       = '';

    constructor (props: SelectProps) {
        const {
                  list,
                  withSearch,
                  defaultLabel,
                  defaultValue,
                  styleType,
                  ...other
              } = props;

        super('div', other);

        this._defaultValue     = this._currentValue = defaultValue;
        this._defaultLabel     = this._currentLabel = defaultLabel;
        this._defaultStyleType = styleType ?? ButtonStyleType.DEFAULT;
        this._list             = list;

        this.element.classList.add(css.container);
        this._list.forEach((item) => {
            if (item.selected) {
                this._select(item);
                return;
            }
        });

        this._selectButton = new Button({
            textContent: this._currentLabel,
            styleType  : this._defaultStyleType,
            fullWidth  : true,
            className  : css.label,
            onclick    : this._toggle.bind(this),
        });
        this._selectButton.insert(this.element, 'afterbegin');

        this._dropdown = new Col({
            rows     : [],
            className: css.dropdown,
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
        this._dropdown.insert(this.element, 'beforeend');
        this._renderOptions();
    }

    getValue () {
        return this._currentValue;
    }

    public get isOpened () {
        return this.element.classList.contains(css.show);
    }

    public show () {
        this.element.classList.add(css.show);
    }

    public hide () {
        this.element.classList.remove(css.show);
    }

    private _renderOptions () {
        this._optionsBox.clear();
        let selected: boolean = this._defaultValue === this._currentValue;
        if (!this._search) {
            this._optionsBox.add(
                new Button({
                    textContent: this._defaultLabel,
                    styleType  : selected ? ButtonStyleType.PRIMARY
                                          : undefined,
                    disabled   : selected,
                    fullWidth  : true,
                    onclick    : () => this._select({
                        label: this._defaultLabel,
                        value: this._defaultValue,
                    }),
                }),
            );
        }
        this._list
            .filter((item) => item.label.match(new RegExp(this._search, 'gi')) || item.value.match(this._search))
            .forEach((item) => {
                selected = item.value === this._currentValue;
                this._optionsBox.add(
                    new Button({
                        textContent: `${ item.label } (${ item.value })`,
                        styleType  : selected ? ButtonStyleType.PRIMARY
                                              : undefined,
                        disabled   : selected,
                        fullWidth  : true,
                        onclick    : () => this._select(item),
                    }),
                );
            });
    }

    private _select (item: SelectOption) {
        this._currentValue = item.value;
        this._currentLabel = item.label;
        this.hide();
        this._selectButton.element.textContent = this._currentLabel;
        if (this._currentValue === this._defaultValue) {
            this._selectButton.setStyleType(this._defaultStyleType);
        } else {
            this._selectButton.setStyleType(ButtonStyleType.PRIMARY);
        }
    }

    private _toggle () {
        if (this.isOpened) {
            this.hide();
        } else {
            this._renderOptions();
            this.show();
        }
    }
}