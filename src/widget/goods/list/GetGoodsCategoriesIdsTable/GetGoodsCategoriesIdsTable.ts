import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    getGoodsCategoriesDomAction,
} from '@/action/goods/list/dom-actions/getGoodsCategories.dom-action.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import {
    getGoodsCategoryRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategory.request-action.ts';
import {
    GoodsCategoryFullData,
} from '@/action/goods/list/types/goods-category.types.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import css from './GetGoodsCategoriesIdsTable.module.css';


export type GetGoodsCategoriesIdsTableProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    };

export class GetGoodsCategoriesIdsTable extends Component<HTMLDivElement> {
    private readonly _clientId: string                 = '';
    private readonly _categoriesToUpdate: Array<[
        {
            id: string,
            title: string
        },
        number
    ]>                                                 = [];
    private readonly _promiseSplitter: PromiseSplitter = new PromiseSplitter(PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY);
    private readonly _logger: Logger                   = new Logger({});
    private readonly _table: Table;
    private readonly _progressBar: ProgressBar;

    constructor (props: GetGoodsCategoriesIdsTableProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);

        this._clientId   = clientId;
        const categories = getGoodsCategoriesDomAction();

        this._table = new Table({
            header: [ 'title', 'id' ],
        });
        this._table.insert(this.element, 'afterbegin');

        categories.forEach((category, index) => {
            this._table.addRow([ category.title, category.id ]);
            if (category.title.slice(-3) === '...') {
                this._categoriesToUpdate.push([ category, index ]);
            }
        });

        this._progressBar = new ProgressBar({ max: this._categoriesToUpdate.length });
        this._logger      = new Logger({
            className: css.logger,
        });

        if (this._categoriesToUpdate.length) {
            this._progressBar.insert(this.element, 'afterbegin');
            this._logger.insert(this._progressBar.element, 'afterend');
        }

        let successAmount: number = 0;
        let errorAmount: number   = 0;
        this._promiseSplitter.exec(
            this._categoriesToUpdate.map(
                ({ 0: categoryMeta, 1: index }) => {
                    return {
                        chain    : [
                            async () => getGoodsCategoryRequestAction(this._clientId, categoryMeta.id),
                            async (data: unknown) => this._table.updateRow(index, [ (data as GoodsCategoryFullData).title, (data as GoodsCategoryFullData).id ]),
                        ],
                        onBefore : () => {
                            this._logger.log(`обновление данных категории "${ categoryMeta.title }"`);
                        },
                        onSuccess: () => {
                            this._progressBar.setLeftProgress(++successAmount);
                            this._logger.success(`данные для категории "${ categoryMeta.title }" обновлены`);
                        },
                        onError  : () => {
                            this._progressBar.setRightProgress(++errorAmount);
                            this._logger.error(`данные для категории "${ categoryMeta.title }" не обновлены`);
                        },
                    };
                },
            ),
        );
    }
}