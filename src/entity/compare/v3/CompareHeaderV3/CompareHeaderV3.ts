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
import { CompareType } from '@/entity/compare/v3/Compare.types.ts';
import {
    ICompareRowV3,
} from '@/entity/compare/v3/CompareRowV3/CompareRowV3.interface.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Details } from '@/shared/box/Details/Details.ts';


export type CompareHeaderV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        headerOriginal: string;
        label: string;
        headerCompare?: string;
        onActivateAll?: () => void;
        onActivateOnlyChildren?: () => void;
        onActivateOnlyItem?: () => void;
        onDeactivate?: () => void;
        rows: Array<ICompareRowV3>;
        variants: Array<SelectOption>;
        onVariantChange: (option: SelectOption) => void;
    };

export class CompareHeaderV3 extends Component<HTMLDivElement> implements ICompareHeaderV3 {
    private readonly _headerOriginal: string;
    private readonly _selectButton: Select;

    constructor (props: CompareHeaderV3Props) {
        const {
                  headerOriginal,
                  label,
                  headerCompare,
                  onActivateOnlyChildren,
                  onActivateOnlyItem,
                  onActivateAll,
                  onDeactivate,
                  variants,
                  onVariantChange,
                  rows,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._headerOriginal = headerOriginal;

        this._selectButton = new Select({
            defaultValue    : '0',
            defaultLabel    : 'Все',
            defaultShowLabel: '+',
            list            : [
                {
                    label    : 'Только это',
                    showLabel: '->',
                    value    : '1',
                },
                {
                    label    : 'Только дочерние',
                    showLabel: 'V',
                    value    : '2',
                },
                {
                    label    : 'Ничего не делать',
                    showLabel: '=',
                    value    : '3',
                },
            ],
            onChange        : (data) => {
                switch (data.value) {
                    case '0':
                        return onActivateAll?.();
                    case '1':
                        return onActivateOnlyItem?.();
                    case '2':
                        return onActivateOnlyChildren?.();
                    case '3':
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

        const content = new Details({
            className: css.content,
            header   : new Component<HTMLDivElement>('div', { className: css.data }, [
                new Component<HTMLDivElement>('div', { textContent: headerOriginal }),
                new Component<HTMLDivElement>('div', { textContent: label }),
                new Component<HTMLDivElement>('div', {}, [
                    new Select({
                        defaultValue: '0',
                        defaultLabel: headerCompare ?? '-',
                        list        : variants,
                        isModal     : true,
                        modalLabel  : `Выберите ${ label }`,
                        showValue   : false,
                        className   : css.headerSelect,
                        onChange    : onVariantChange,
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
        this._updateValidation(headerCompare);
    }

    setValidationType (type: CompareType): void {
        switch (type) {
            case CompareType.VALID:
                this._selectButton.setStyleType(ButtonStyleType.DEFAULT);
                break;
            case CompareType.NO_VALID:
                this._selectButton.setStyleType(ButtonStyleType.WARNING);
                break;
            case CompareType.NO_EXIST:
                this._selectButton.setStyleType(ButtonStyleType.DANGER);
                break;
            default:
                break;
        }
    }

    private _updateValidation (headerCompare?: string) {
        if (typeof headerCompare !== 'string') {
            this._selectButton.setStyleType(ButtonStyleType.DANGER);
        } else if (headerCompare !== this._headerOriginal) {
            this._selectButton.setStyleType(ButtonStyleType.WARNING);
        } else {
            this._selectButton.setStyleType(ButtonStyleType.DEFAULT);
        }
    }
}