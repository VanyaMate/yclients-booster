import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import { Nullable } from '@/types/Nullable';
import { Row } from '@/shared/box/Row/Row.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import css from './CompareListValue.module.css';


export type ListItemType = {
    id: string;
    value: string;
}

export type ListMapper = Record<string, string>;

export type CompareListValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        list?: Array<ListItemType>;
        mapper: ListMapper;
        showAddMoreButton?: boolean;
        disable?: boolean;
    };

export class CompareListValue extends Component<HTMLDivElement> implements ICompareValue<Array<ListItemType>> {
    private readonly _mapper: ListMapper       = {};
    private _currentList?: Array<ListItemType> = [];
    private _content: Col;

    constructor (props: CompareListValueProps) {
        const {
                  list, mapper, showAddMoreButton = true, disable = false,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        if (disable) {
            this.element.classList.add(css.disable);
        }

        this._currentList = list ? [ ...list ] : undefined;
        this._mapper      = mapper;

        this._content = new Col({
            rows: this._getListItems(),
        });

        this._content.insert(this.element, 'afterbegin');

        if (showAddMoreButton) {
            new Button({
                textContent: 'Добавить еще',
                onclick    : () => {
                    this._content.add(
                        this._getListItem({
                            id: '', value: 'Привет',
                        }),
                    );
                },
            }).insert(this.element, 'beforeend');
        }
    }

    getValue (): Nullable<Array<ListItemType>> {
        if (this._currentList) {
            return this._currentList
                .filter((item) => item.value)
                .sort((a, b) => a.id.localeCompare(b.id));
        }

        return null;
    }

    private _getListItems () {
        return this.getValue()?.map((listItem) => this._getListItem(listItem)) ?? [];
    }

    private _getListItem (listItem: ListItemType) {
        const content = new Row({
            cols     : [
                new Component<HTMLElement>('div', {
                    textContent: this._mapper[listItem.id],
                    className  : css.label,
                }),
                new TextInput({
                    type     : 'text',
                    value    : listItem.value,
                    className: css.input,
                }),
                new Button({
                    textContent: 'Удалить',
                    styleType  : ButtonStyleType.DEFAULT,
                    onclick    : () => content.remove(),
                    className  : css.button,
                }),
            ],
            className: css.row,
        });

        return content;
    }
}