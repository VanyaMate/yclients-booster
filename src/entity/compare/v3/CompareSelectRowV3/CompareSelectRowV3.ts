import { ICompareComponentV3 } from '@/entity/compare/v3/Compare.types.ts';
import {
    CompareComponentV3,
} from '@/entity/compare/v3/CompareComponent/CompareComponentV3.ts';
import { Select, SelectProps } from '@/shared/input/Select/Select.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import commonCss
    from '@/entity/compare/v3/CompareRowV3/CompareRowV3.module.css';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';
import css from './CompareSelectRowV3.module.css';


export type CompareSelectRowV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetSelectData: SelectProps;
        label: string;
        clientSelectedId?: string;
        clientSelectedLabel?: string;
    }

export class CompareSelectRowV3 extends CompareComponentV3 implements ICompareComponentV3 {
    private readonly _clientSelectedId?: string;
    private readonly _select: Select;

    constructor (props: CompareSelectRowV3Props) {
        const {
                  targetSelectData,
                  clientSelectedId,
                  clientSelectedLabel,
                  label,
                  ...other
              }                      = props;
        const isClientEmpty: boolean = clientSelectedId === undefined;
        let select: Select;
        super(other, [
            new Component<HTMLDivElement>('div', {}, [
                select = new Select({
                    ...targetSelectData,
                    onChange : (data) => {
                        this._revalidate();
                        targetSelectData.onChange?.(data);
                        this.element.dispatchEvent(CompareEvent);
                    },
                    className: css.select,
                }),
            ]),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {
                textContent: isClientEmpty ? 'Пусто' : clientSelectedLabel,
                className  : isClientEmpty ? commonCss.empty : '',
            }),
        ]);

        this._clientSelectedId = clientSelectedId;
        this._select           = select;

        this.element.classList.add(css.container);
        this.element.classList.add(commonCss.container);
        this._revalidate();
    }

    public get isValid (): boolean {
        if (!this._enabled) {
            return true;
        }

        if (this._clientSelectedId === undefined) {
            return false;
        }

        return this._clientSelectedId === this._select.getValue();
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(commonCss.disabled);
        } else {
            this.element.classList.add(commonCss.disabled);
        }
    }

    protected _revalidate () {
        const isValid = this._select.getValue() === this._clientSelectedId;

        if (!isValid) {
            this.element.classList.add(commonCss.invalid);
        } else {
            this.element.classList.remove(commonCss.invalid);
        }
    }
}