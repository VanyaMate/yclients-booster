import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    FinancesExpense,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    CopyFinancesExpenseCompareComponent,
} from '@/widget/finances/expenses/CopyFinancesExpenseCompareComponent/CopyFinancesExpenseCompareComponent.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';


export type CopyFinancesExpensesCompareComponentProps =
    {
        clientId: string;
        targetExpenses: Array<FinancesExpense>;
        clientExpenses: Array<FinancesExpense>;
        fetcher?: IFetcher;
        logger?: ILogger;
    }
    & CompareComponentProps;

export class CopyFinancesExpensesCompareComponent extends CompareComponent<void> {
    private readonly _clientId: string;
    private readonly _targetExpenses: Array<FinancesExpense>;
    private readonly _clientExpenses: Array<FinancesExpense>;
    private readonly _fetcher?: IFetcher;
    private readonly _logger?: ILogger;
    private readonly _compareComponents: Array<CopyFinancesExpenseCompareComponent> = [];

    constructor (props: CopyFinancesExpensesCompareComponentProps) {
        const {
                  clientExpenses,
                  targetExpenses,
                  clientId,
                  fetcher,
                  logger,
                  ...other
              } = props;
        super(other);

        this._clientId       = clientId;
        this._clientExpenses = clientExpenses;
        this._targetExpenses = targetExpenses;
        this._fetcher        = fetcher;
        this._logger         = logger;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return this._compareComponents;
    }

    protected async _action (): Promise<void | null> {
        await new PromiseSplitter(5, 2).exec(
            this._compareComponents.map((component) => ({
                chain: [ component.getAction() ],
            })),
        );
        return null;
    }

    protected _render (): void {
        this._targetExpenses.forEach((expense) => {
            this._compareComponents.push(
                new CopyFinancesExpenseCompareComponent({
                    clientId      : this._clientId,
                    targetExpense : expense,
                    clientExpenses: this._clientExpenses,
                    fetcher       : this._fetcher,
                    logger        : this._logger,
                    parent        : this,
                }),
            );
        });
        new Col({ rows: this._compareComponents }).insert(this.element, 'afterbegin');
    }
}