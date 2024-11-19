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


export enum CompareState {
    VALID,
    WARNING,
    CRITICAL
}

export type CompareHeaderProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        titleFrom: string;
        label?: string;
        idTo?: string | null;
        titleTo?: string | null;
        forceState?: CompareState;
        variants?: Array<{ id: string, title: string }>;
        onVariantChange?: (id: string) => void;
        modalLabel?: string;
    };

export class CompareHeader extends Component<HTMLDivElement> implements ICompareComponent<HTMLDivElement> {
    constructor (props: CompareHeaderProps) {
        const {
                  label      = '',
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
        this.element.innerHTML = `
                <span>${ titleFrom }</span>
                <span>${ label }</span>
            `;

        if (typeof titleTo !== 'string' || forceState === CompareState.CRITICAL) {
            this.element.classList.add(css.critical);
        } else if (titleFrom !== titleTo || forceState === CompareState.WARNING) {
            this.element.classList.add(css.warning);
        } else {
            this.element.classList.add(css.valid);
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
            new Component('span', {}, [ select ]).insert(this.element, 'beforeend');
        } else {
            this.element.innerHTML += `<span>${ titleTo ?? '-' }</span>`;
        }
    }

    getValid (): boolean {
        return this.element.classList.contains(css.valid);
    }
}