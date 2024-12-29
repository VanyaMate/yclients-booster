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
import { Col } from '@/shared/box/Col/Col.ts';
import css from './CompareListValue.module.css';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export type ListItemType = {
    id: string;
    value: string;
}

export type ListMapper = Record<string, string>;

export type CompareListValueOnChangeHandler = (item: ListItemType) => void;

export type CompareListValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        list?: Array<ListItemType>;
        mapper: ListMapper;
        showAddMoreButton?: boolean;
        disable?: boolean;
        onChange?: CompareListValueOnChangeHandler;
    };

export class CompareListValue extends Component<HTMLDivElement> implements ICompareValue<Array<ListItemType>> {
    private readonly _mapper: ListMapper                = {};
    private readonly _currentList?: Array<ListItemType> = [];
    private readonly _content: Col;
    private readonly _onChange?: CompareListValueOnChangeHandler;

    constructor (props: CompareListValueProps) {
        const {
                  list,
                  mapper,
                  showAddMoreButton = true,
                  disable           = false,
                  onChange,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        if (disable) {
            this.element.classList.add(css.disable);
        }

        this._onChange    = onChange;
        this._currentList = list;
        this._mapper      = mapper;

        this._content = new Col({
            rows: this._getListItems(),
        });

        this._content.insert(this.element, 'afterbegin');
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
        return this._currentList?.map(this._getListItem.bind(this)) ?? [];
    }

    private _getListItem (listItem: ListItemType) {
        return new Row({
            cols     : [
                new Component<HTMLDivElement>('div', {
                    textContent: this._mapper[listItem.id],
                    className  : css.label,
                }),
                new TextInput({
                    type       : 'text',
                    value      : listItem.value,
                    className  : css.input,
                    placeholder: 'Значение',
                    onInput    : (value) => {
                        listItem.value = value;
                        this._onChange?.({ id: listItem.id, value });
                        this.element.dispatchEvent(CompareEvent);
                    },
                }),
            ],
            className: css.row,
        });
    }
}