import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from '@/entity/compare/CompareRow/CompareRow.module.css';
import { Select, SelectOption } from '@/shared/input/Select/Select.ts';
import { ButtonStyleType } from '@/shared/buttons/Button/Button.ts';


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
    };

export class CompareHeader extends Component<HTMLDivElement> {
    constructor (props: CompareHeaderProps) {
        const {
                  titleFrom,
                  titleTo,
                  variants   = [],
                  idTo,
                  forceState = CompareState.VALID,
                  onVariantChange,
                  ...other
              } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this.element.innerHTML = `
            <span>${ titleFrom }</span>
            <span class="${ css.label }"></span>
        `;

        if (typeof titleTo !== 'string' || forceState === CompareState.CRITICAL) {
            this.element.classList.add(css.critical);
        } else if (titleFrom !== titleTo || forceState === CompareState.WARNING) {
            this.element.classList.add(css.warning);
            this.element.title = titleTo;
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
                modalLabel  : 'Выбор варианта',
                onChange    : (option: SelectOption) => onVariantChange?.(option.value),
            });
            select.insert(this.element, 'beforeend');
        } else {
            this.element.innerHTML += `<span>${ titleTo ?? '-' }</span>`;
        }
    }
}