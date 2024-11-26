import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.interface.ts';
import css from './CompareHeaderV3.module.css';
import { Select } from '@/shared/input/Select/Select.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


export type CompareHeaderV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        headerOriginal: string;
        label: string;
        headerCompare?: string;
        onActivate?: () => void;
        onDeactivate?: () => void;
        onDeactivateAll?: () => void;
    };

export class CompareHeaderV3 extends Component<HTMLDivElement> implements ICompareHeaderV3<string> {
    private _compareHeader: Component<HTMLDivElement>;
    private _headerOriginal: string;
    private _selectButton: Select;

    constructor (props: CompareHeaderV3Props) {
        const {
                  headerOriginal,
                  label,
                  headerCompare,
                  onDeactivateAll,
                  onDeactivate,
                  onActivate,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._headerOriginal = headerOriginal;

        this._selectButton = new Select({
            defaultValue    : '0',
            defaultLabel    : 'Активировать',
            defaultShowLabel: '+',
            list            : [
                {
                    label    : 'Ничего не делать',
                    showLabel: '-',
                    value    : '1',
                },
                {
                    label    : 'Ничего не делать и внутри',
                    showLabel: '=',
                    value    : '2',
                },
            ],
            onChange        : (data) => {
                switch (data.value) {
                    case '0':
                        return onActivate?.();
                    case '1':
                        return onDeactivate?.();
                    case '2':
                        return onDeactivateAll?.();
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

        new Component<HTMLDivElement>('div', { className: css.data }, [
            new Component<HTMLDivElement>('div', { textContent: headerOriginal }),
            new Component<HTMLDivElement>('div', { textContent: label }),
            this._compareHeader = new Component<HTMLDivElement>('div', { textContent: headerCompare ?? '-' }),
        ])
            .insert(this.element, 'beforeend');


        this._updateValidation(headerCompare);
    }

    update (headerCompare: string): void {
        this._compareHeader.element.textContent = headerCompare;
        this._updateValidation(headerCompare);
    }

    private _updateValidation (headerCompare?: string) {
        this.element.className = css.container;
        if (typeof headerCompare !== 'string') {
            this._selectButton.setStyleType(ButtonStyleType.DANGER);
        } else if (headerCompare !== this._headerOriginal) {
            this._selectButton.setStyleType(ButtonStyleType.WARNING);
        } else {
            this._selectButton.setStyleType(ButtonStyleType.DEFAULT);
        }
    }
}