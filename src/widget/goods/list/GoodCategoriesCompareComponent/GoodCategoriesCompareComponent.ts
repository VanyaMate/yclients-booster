import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import {
    GoodsCategoryFullData, GoodsCategoryTreeFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GoodCategoryCompareComponent,
} from '@/widget/goods/list/GoodCategoryCompareComponent/GoodCategoryCompareComponent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { ICompareEntity } from '@/entity/compare/Compare.types.ts';


export type GoodCategoriesCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        targetCategories: Array<GoodsCategoryTreeFullData>;
        clientCategories: Array<GoodsCategoryTreeFullData>;
        logger?: ILogger;
        fetcher?: IFetcher;
    }

export class GoodCategoriesCompareComponent extends CompareComponent<Array<GoodsCategoryFullData>> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _targetCategories: Array<GoodsCategoryTreeFullData>;
    private readonly _clientCategories: Array<GoodsCategoryTreeFullData>;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _categoriesComponents: Array<GoodCategoryCompareComponent> = [];

    constructor (props: GoodCategoriesCompareComponentProps) {
        const {
                  clientId,
                  bearer,
                  targetCategories,
                  clientCategories,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId         = clientId;
        this._bearer           = bearer;
        this._targetCategories = targetCategories;
        this._clientCategories = clientCategories;
        this._logger           = logger;
        this._fetcher          = fetcher;

        this._render();
    }

    public getChildren (): Array<ICompareEntity<any>> {
        return this._categoriesComponents;
    }

    protected _action (): Promise<GoodsCategoryFullData[] | null> {
        return new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY)
            .exec(
                this._categoriesComponents.map(
                    (component) => ({
                        chain: [ component.getAction('0') ],
                    }),
                ),
            );
    }

    protected _render (): void {
        this._beforeRender();

        this._categoriesComponents = this._targetCategories.map((targetCategory) => (
            new GoodCategoryCompareComponent({
                clientId        : this._clientId,
                bearer          : this._bearer,
                logger          : this._logger,
                targetCategory  : targetCategory,
                clientCategories: this._clientCategories,
                fetcher         : this._fetcher,
            })
        ));

        new Col({ rows: this._categoriesComponents }).insert(this.element, 'afterbegin');
        this._beforeEndRender();
    }
}