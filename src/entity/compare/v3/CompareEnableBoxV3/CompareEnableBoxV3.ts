import {
    CompareComponentV3Props,
} from '@/entity/compare/v3/CompareComponent/CompareComponentV3.ts';
import { ICompareComponentV3 } from '@/entity/compare/v3/Compare.types.ts';
import css from './CompareEnableBoxV3.module.css';
import { Toggle } from '@/shared/input/Toggle/Toggle.ts';
import commonCss
    from '@/entity/compare/v3/CompareRowV3/CompareRowV3.module.css';
import { Component } from '@/shared/component/Component.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';


export type CompareEnableBoxV3Props =
    CompareComponentV3Props
    & {
        label: string;
        onToggle: (status: boolean) => void;
        targetStatus: boolean;
        clientStatus?: boolean;
        components: Array<ICompareComponentV3>;
    };

export class CompareEnableBoxV3 extends Component<HTMLDivElement> implements ICompareComponentV3 {
    private readonly _children: Array<ICompareComponentV3> = [];
    private readonly _clientStatus?: boolean;
    private _currentStatus: boolean;
    private _enableTitle: Component<HTMLDivElement>;
    private _enabled: boolean                              = true;

    constructor (props: CompareEnableBoxV3Props) {
        const {
                  label,
                  onToggle,
                  targetStatus,
                  clientStatus,
                  components,
                  ...other
              }                      = props;
        const isClientEmpty: boolean = clientStatus === undefined;
        super('div', other);

        this._currentStatus = targetStatus;
        this._children      = components;
        this._clientStatus  = clientStatus;

        this.element.classList.add(css.container);

        if (targetStatus) {
            this.element.classList.remove(css.toggleDisable);
        } else {
            this.element.classList.add(css.toggleDisable);
        }

        this._enableTitle = new Component<HTMLDivElement>('div', {
            className: commonCss.container,
        }, [
            new Toggle({
                value   : targetStatus,
                onChange: (status) => {
                    this._toggle(status);
                    onToggle?.(status);
                },
            }),
            new Component<HTMLDivElement>('div', { textContent: label }),
            new Component<HTMLDivElement>('div', {
                textContent: isClientEmpty ? 'Пусто' : clientStatus
                                                       ? 'Вкл'
                                                       : 'Выкл',
                className  : isClientEmpty ? commonCss.empty : '',
            }),
        ]);

        this._enableTitle.insert(this.element, 'afterbegin');

        new Col({
            rows     : components,
            className: css.children,
        })
            .insert(this.element, 'beforeend');
    }

    enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disable);
        } else {
            this.element.classList.add(css.disable);
        }
    }

    public get isValid (): boolean {
        if (!this._enabled) {
            return true;
        }

        return this._currentStatus === this._clientStatus && this._children.every((child) => child.isValid);
    }

    private _toggle (status: boolean) {
        this._currentStatus = status;
        this.element.dispatchEvent(CompareEvent);
        this._revalidate();

        if (status) {
            this.element.classList.remove(css.toggleDisable);
        } else {
            this.element.classList.add(css.toggleDisable);
        }
    }

    protected _revalidate () {
        if (this._clientStatus === undefined) {
            this._enableTitle.element.classList.add(commonCss.invalid);
        } else if (this._clientStatus !== this._currentStatus) {
            this._enableTitle.element.classList.add(commonCss.invalid);
        } else {
            this._enableTitle.element.classList.remove(commonCss.invalid);
        }
    }
}