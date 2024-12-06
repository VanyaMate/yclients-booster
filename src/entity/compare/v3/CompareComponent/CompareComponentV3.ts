import {
    CompareResult,
    CompareType,
    ICompareComponentV3,
} from '@/entity/compare/v3/Compare.types.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.interface.ts';
import css from './CompareComponentV3.module.css';
import { IComponent } from '@/shared/component/Component.interface.ts';


export type CompareComponentV3Props =
    ComponentPropsOptional<HTMLDivElement>
    & {};

export abstract class CompareComponentV3 extends Component<HTMLDivElement> implements ICompareComponentV3 {
    protected _header?: ICompareHeaderV3;
    protected _compareRows: Array<ICompareComponentV3>     = [];
    protected _compareChildren: Array<ICompareComponentV3> = [];
    protected _compareType: CompareType                    = CompareType.ALL;
    protected _enabled: boolean                            = true;

    protected constructor (props: CompareComponentV3Props, children: Array<IComponent<HTMLElement>> = []) {
        super('div', props, children);
        this.element.classList.add(css.container);
    }

    public abstract get isValid (): boolean;

    public enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disable);
        } else {
            this.element.classList.add(css.disable);
        }
    }

    protected _setCompareType (value: CompareType): void {
        this._compareType = value;

        switch (value) {
            case CompareType.ALL:
                this._header?.enable(true);
                this._compareRows.forEach((row) => row.enable(true));
                this._compareChildren.forEach((row) => row.enable(true));
                break;
            case CompareType.ITEM:
                this._header?.enable(true);
                this._compareRows.forEach((row) => row.enable(true));
                this._compareChildren.forEach((row) => row.enable(false));
                break;
            case CompareType.CHILDREN:
                this._header?.enable(false);
                this._compareRows.forEach((row) => row.enable(false));
                this._compareChildren.forEach((row) => row.enable(true));
                break;
            default:
                this._header?.enable(false);
                this._compareRows.forEach((row) => row.enable(false));
                this._compareChildren.forEach((row) => row.enable(false));
                break;
        }

        this.element.dispatchEvent(CompareEvent);
    }


    protected _revalidate (uniqueItem: unknown) {
        if (this._compareType === CompareType.NONE) {
            this._header?.setValidationType(CompareResult.VALID);
        } else if (uniqueItem === undefined) {
            this._header?.setValidationType(CompareResult.NO_EXIST);
        } else if (!this.isValid) {
            this._header?.setValidationType(CompareResult.NO_VALID);
        } else {
            this._header?.setValidationType(CompareResult.VALID);
        }
    }
}