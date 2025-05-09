import {
    CompareProcess,
    CompareResult,
    CompareType,
    ICompareComponent, ICompareEntity,
} from '../Compare.types.ts';
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
    & {
        parent?: ICompareEntity<any>;
    };

/**
 * Для кастомных нужен:
 * 1. Список всех клиента "clientItems"
 * 2. Один таргетный "targetItem"
 * 3. clientId
 * 4. bearer?
 * 5. logger?
 * 6. fetcher?
 * 7. parent? ICompareEntity<any>
 */
export abstract class CompareComponent<ActionResponseType> extends Component<HTMLDivElement> implements ICompareEntity<ActionResponseType> {
    private _revalidateTimer?: ReturnType<typeof setTimeout>;
    protected _header: ICompareHeader | null             = null;
    protected _compareRows: Array<ICompareComponent>     = [];
    protected _compareChildren: Array<ICompareComponent> = [];
    protected _compareType: CompareType                  = CompareType.ALL;
    protected _enabled: boolean                          = true;
    protected _uniqueItem?: any;
    protected _parent?: ICompareEntity<any>;
    private _isValid: boolean;

    protected constructor (props: CompareComponentProps, children: Array<IComponent<HTMLElement>> = []) {
        super('div', props, children);
        this.element.classList.add(css.container);
        this._parent  = props.parent;
        this._isValid = this._validate();
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
        return this._isValid;
    }

    public getAction (data?: any): () => Promise<ActionResponseType | null> {
        if (this._enabled) {
            this._onBeforeAction();
            return () => {
                this._onStartAction();
                return this._action(data)
                    .then(this._onSuccessAction.bind(this))
                    .catch((e) => {
                        console.error('ERROR_FROM', this, e);
                        this._onErrorAction();
                        throw e;
                    });
            };
        }

        return async () => null;
    }

    public getHeader (): ICompareHeader | null {
        return this._header;
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return [];
    }

    public revalidateWithParents (uniqueItem?: unknown) {
        this._revalidate(uniqueItem ?? this._uniqueItem)
            .then(() => this._parent?.revalidateWithParents());
    }

    /**
     *
     *  Сделать так, что null возвращается специально, а undefined - если ошибка
     *
     *  Template:
     *  ```typescript
     *        if (this._clientService) {
     *             if (this._itemIsValid()) {
     *                 if (this._childrenIsValid()) {
     *                     // return item
     *                     return this._clientService;
     *                 } else {
     *                     // action children
     *                     // return item
     *                 }
     *             } else {
     *                 if (this._childrenIsValid()) {
     *                     // update item
     *                     // return item
     *                 } else {
     *                     // update item
     *                     // action children
     *                     // return item
     *                 }
     *             }
     *         } else {
     *             if (!this._isNoCreateNew()) {
     *                 // create item
     *
     *                 if (!this._childrenIsValid()) {
     *                     // action children
     *                 }
     *
     *                 // return item
     *             }
     *
     *              return null;
     *         }
     *  ```
     * @param data
     * @returns {Promise}
     * @protected
     */
    protected abstract _action (data?: any): Promise<ActionResponseType | null>;

    protected abstract _render (): void;

    protected _beforeRender () {
        this.element.innerHTML = ``;
    }

    protected _beforeEndRender (uniqueItem?: unknown) {
        this._uniqueItem = undefined;
        this.revalidateWithParents(uniqueItem);

        if (this._header) {
            this._header.onActivateAll(this._setCompareType.bind(this, CompareType.ALL));
            this._header.onActivateOnlyItem(this._setCompareType.bind(this, CompareType.ITEM));
            this._header.onActivateOnlyChildren(this._setCompareType.bind(this, CompareType.CHILDREN));
            this._header.onDeactivate(this._setCompareType.bind(this, CompareType.NONE));
            this._header.setParent(this);
            this._header.insert(this.element, 'afterbegin');
        }
    }

    protected _isNoCreateNew () {
        return this._compareType === CompareType.NONE || this._compareType === CompareType.CHILDREN;
    }

    protected _itemIsValid () {
        if (this._enabled && (this._compareType === CompareType.ITEM || this._compareType === CompareType.ALL)) {
            if (this._header) {
                return this._header.isValid && this._compareRows.every((row) => row.isValid);
            }

            return this._compareRows.every((row) => row.isValid);
        }

        return true;
    }

    protected _headerIsValid () {
        if (this._header && this._enabled && (this._compareType === CompareType.ITEM || this._compareType === CompareType.ALL)) {
            return this._header?.isValid;
        }

        return true;
    }

    protected _rowsIsValid () {
        if (this._enabled && (this._compareType === CompareType.ITEM || this._compareType === CompareType.ALL)) {
            return this._compareChildren.every((component) => component.isValid);
        }

        return true;
    }

    protected _childrenIsValid () {
        if (this._enabled && (this._compareType === CompareType.CHILDREN || this._compareType === CompareType.ALL)) {
            return this._compareChildren.every((component) => component.isValid);
        }

        return true;
    }

    protected _onBeforeAction () {
        this._header?.setProcessType(CompareProcess.IDLE);
    }

    protected _onStartAction () {
        this._header?.setProcessType(CompareProcess.PROCESS);
    }

    protected _onSuccessAction (data: ActionResponseType | null) {
        this._header?.setProcessType(CompareProcess.SUCCESS);
        return data;
    }

    protected _onErrorAction () {
        this._header?.setProcessType(CompareProcess.ERROR);
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

        this.revalidateWithParents();
    }

    protected _revalidate (uniqueItem?: unknown): Promise<void> {
        this._uniqueItem = uniqueItem;
        clearTimeout(this._revalidateTimer);
        return new Promise((resolve) => {
            this._revalidateTimer = setTimeout(() => {
                if (this._compareType === CompareType.NONE) {
                    this._isValid = true;
                    this._header?.setValidationType(CompareResult.VALID);
                } else if (uniqueItem === undefined) {
                    this._isValid = false;
                    this._header?.setValidationType(CompareResult.NO_EXIST);
                } else if (this._validate()) {
                    this._isValid = true;
                    this._header?.setValidationType(CompareResult.VALID);
                } else {
                    this._isValid = false;
                    this._header?.setValidationType(CompareResult.NO_VALID);
                }

                resolve();
            });
        });
    }

    private _validate (): boolean {
        if (this._enabled) {
            switch (this._compareType) {
                case CompareType.ALL:
                    return (
                        (this._header ? this._header.isValid : true) &&
                        this._compareRows.every((row) => row.isValid) &&
                        this._compareChildren.every((child) => child.isValid)
                    );
                case CompareType.ITEM:
                    return (
                        (this._header ? this._header.isValid : true) &&
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
}