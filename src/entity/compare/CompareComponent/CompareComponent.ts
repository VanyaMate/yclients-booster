import {
    CompareResult,
    CompareType,
    ICompareComponent,
} from '../Compare.types.ts';
import { CompareEvent } from '../CompareEvent.ts';
import css from './CompareComponentV3.module.css';
import { IComponent } from '@/shared/component/Component.interface.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareHeader,
} from '@/entity/compare/CompareHeader/CompareHeader.interface.ts';


export type CompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {};

/**
 * Для кастомных нужен:
 * 1. Список всех клиента "clientItems"
 * 2. Один таргетный "targetItem"
 * 3. clientId
 * 4. bearer?
 * 5. logger?
 * 6. fetcher?
 */
export abstract class CompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    protected _header?: ICompareHeader;
    protected _compareRows: Array<ICompareComponent>     = [];
    protected _compareChildren: Array<ICompareComponent> = [];
    protected _compareType: CompareType                  = CompareType.ALL;
    protected _enabled: boolean                          = true;

    protected constructor (props: CompareComponentProps, children: Array<IComponent<HTMLElement>> = []) {
        super('div', props, children);
        this.element.classList.add(css.container);
    }

    public enable (status: boolean): void {
        this._enabled = status;

        if (status) {
            this.element.classList.remove(css.disable);
        } else {
            this.element.classList.add(css.disable);
        }
    }

    public get isValid () {
        if (this._enabled) {
            switch (this._compareType) {
                case CompareType.ALL:
                    return (
                        this._header!.isValid &&
                        this._compareRows.every((row) => row.isValid) &&
                        this._compareChildren.every((child) => child.isValid)
                    );
                case CompareType.ITEM:
                    return (
                        this._header!.isValid &&
                        this._compareRows.every((row) => row.isValid)
                    );
                case CompareType.CHILDREN:
                    return (
                        this._compareChildren.every((child) => child.isValid)
                    );
                default:
                    return true;
            }
        }

        return true;
    }

    protected _headerIsValid () {
        if (this._header && this._enabled && this._compareType === CompareType.ITEM || this._compareType === CompareType.ALL) {
            return this._header?.isValid;
        }

        return true;
    }

    protected _rowsIsValid () {
        if (this._enabled && this._compareType === CompareType.ITEM || this._compareType === CompareType.ALL) {
            return this._compareChildren.every((component) => component.isValid);
        }

        return true;
    }

    protected _childrenIsValid () {
        if (this._enabled && this._compareType === CompareType.CHILDREN || this._compareType === CompareType.ALL) {
            return this._compareChildren.every((component) => component.isValid);
        }

        return true;
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

    protected abstract _render (): void;
}