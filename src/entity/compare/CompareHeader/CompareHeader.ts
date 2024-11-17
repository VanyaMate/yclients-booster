import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './CompareHeader.module.css';
import { Select, SelectOption } from '@/shared/input/Select/Select.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    ICompareComponent,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';
import {
    CompareStateIcon,
    CompareStateIconType, ICompareStateIcon,
} from '@/entity/compare/CompareStateIcon/CompareStateIcon.ts';


export enum CompareState {
    VALID,
    WARNING,
    CRITICAL
}

export type CompareHeaderProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
    titleFrom: string;
    idTo?: string | null;
    titleTo?: string | null;
    forceState?: CompareState;
    variants?: Array<{ id: string, title: string }>;
    onVariantChange?: (id: string) => void;
    modalLabel?: string;
};

export class CompareHeader extends Component<HTMLDivElement> implements ICompareComponent<HTMLDivElement>, ICompareStateIcon {
    private _icon: CompareStateIcon;

    constructor (props: CompareHeaderProps) {
        const {
                  titleFrom,
                  titleTo,
                  variants   = [],
                  idTo,
                  forceState = CompareState.VALID,
                  onVariantChange,
                  modalLabel,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);

        const info = new Component<HTMLDivElement>('div', {
            innerHTML: `
                <span>${ titleFrom }</span>
                <span></span>
            `,
            className: css.info,
        });

        this._icon = new CompareStateIcon({
            init: CompareStateIconType.IDLE,
        });

        info.insert(this.element, 'beforeend');
        this._icon.insert(this.element, 'afterbegin');

        if (typeof titleTo !== 'string' || forceState === CompareState.CRITICAL) {
            info.element.classList.add(css.critical);
        } else if (titleFrom !== titleTo || forceState === CompareState.WARNING) {
            info.element.classList.add(css.warning);
        } else {
            info.element.classList.add(css.valid);
        }

        if (variants.length) {
            const select = new Select({
                defaultLabel: 'Создать новый',
                defaultValue: '-1',
                list        : variants.map((variant) => ({
                    label   : variant.title,
                    value   : variant.id,
                    selected: variant.id === idTo,
                })),
                withSearch  : true,
                styleType   : ButtonStyleType.DEFAULT,
                isModal     : true,
                className   : css.select,
                modalLabel  : modalLabel ?? 'Выберите вариант',
                onChange    : (option: SelectOption) => onVariantChange?.(option.value),
            });
            new Component('span', {}, [ select ]).insert(info.element, 'beforeend');
        } else {
            info.element.innerHTML += `<span>${ titleTo ?? '-' }</span>`;
        }
    }

    getValid (): boolean {
        return this.element.classList.contains(css.valid);
    }

    setState (state: CompareStateIconType): void {
        this._icon.setState(state);
    }
}