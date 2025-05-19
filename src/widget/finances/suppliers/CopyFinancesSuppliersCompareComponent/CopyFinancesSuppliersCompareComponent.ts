import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    FinancesSupplier,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    CopyFinancesSupplierCompareComponent,
} from '@/widget/finances/suppliers/CopyFinancesSupplierCompareComponent/CopyFinancesSupplierCompareComponent.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';


export type CopyFinancesSupplierCompareComponentProps =
    {
        clientId: string;
        clientSuppliers: Array<FinancesSupplier>;
        targetSuppliers: Array<FinancesSupplier>;
        fetcher?: IFetcher;
        logger?: ILogger;
    }
    & CompareComponentProps;

export class CopyFinancesSuppliersCompareComponent extends CompareComponent<Array<FinancesSupplier>> {
    private readonly _clientId: string;
    private readonly _clientSuppliers: Array<FinancesSupplier>;
    private readonly _targetSuppliers: Array<FinancesSupplier>;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;

    private _compareComponents: Array<CopyFinancesSupplierCompareComponent> = [];

    constructor (props: CopyFinancesSupplierCompareComponentProps) {
        const {
                  clientSuppliers,
                  targetSuppliers,
                  logger,
                  clientId,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId        = clientId;
        this._clientSuppliers = clientSuppliers;
        this._targetSuppliers = targetSuppliers;
        this._fetcher         = fetcher;
        this._logger          = logger;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return this._compareComponents;
    }

    protected _action (): Promise<Array<FinancesSupplier> | null> {
        return new PromiseSplitter(5, 2).exec(
            this._compareComponents.map((component) => ({ chain: [ component.getAction() ] })),
        );
    }

    protected _render (): void {
        this.element.innerHTML = ``;
        new Col({
            rows: this._compareComponents = this._targetSuppliers.map((supplier) => (
                new CopyFinancesSupplierCompareComponent({
                    clientId       : this._clientId,
                    clientSuppliers: this._clientSuppliers,
                    targetSupplier : supplier,
                    fetcher        : this._fetcher,
                    logger         : this._logger,
                    parent         : this,
                })
            )),
        })
            .insert(this.element, 'afterbegin');
    }
}