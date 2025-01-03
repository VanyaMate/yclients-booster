import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    getGoodsCategoriesRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategories.request-action.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Select } from '@/shared/input/Select/Select.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import {
    getSelectedGoodsIdsDomAction,
} from '@/action/goods/list/dom-actions/getSelectedGoodsIds/getSelectedGoodsIds.dom.action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getGoodRequestAction,
} from '@/action/goods/edit/getGood/getGood.request-action.ts';
import { GoodData } from '@/action/goods/types/good.types.ts';
import { Is } from '@/types/Is.ts';
import {
    changeGoodCategoryRequestAction,
} from '@/action/goods/edit/changeGoodCategory/changeGoodCategory.request-action.ts';


export type ChangeManyGoodsCategoryProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class ChangeManyGoodsCategory extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger;
    private readonly _content: Col;

    constructor (props: ChangeManyGoodsCategoryProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);

        this._clientId = clientId;
        this._bearer   = bearer;
        this._logger   = new Logger({});
        this._content  = new Col({
            rows: [ this._logger ],
        });

        this._content.insert(this.element, 'afterbegin');

        const observer = new IntersectionObserver((entries) => {
            if (entries.some((entry) => entry.isIntersecting)) {
                this._renderCategories();
                observer.disconnect();
            }
        });

        observer.observe(this.element);
        // get categories
        // render select
        // render button
        // onButtonClick -> get all selected goods
        // update all goods to new category
    }

    private async _renderCategories () {
        const categories = await getGoodsCategoriesRequestAction(this._bearer, this._clientId, this._logger);
        const select     = new Select({
            defaultLabel: 'Выберите категорию',
            defaultValue: '-1',
            list        : categories.map((category) => ({
                value: category.id,
                label: category.title,
            })),
            showValue   : true,
            withSearch  : true,
            isModal     : true,
            modalLabel  : 'Выберите категорию',
        });
        const button     = new Button({
            textContent: 'Перенести',
            onclick    : async () => {
                if (select.getValue() !== '-1') {
                    button.setLoading(true);
                    const goods = await this._getSelectedGoods();
                    new PromiseSplitter(5, 2).exec(
                        goods.map((good) => ({
                            chain: [
                                () => getGoodRequestAction(this._clientId, good.categoryId, good.id, this._logger),
                                async (goodData: unknown) => {
                                    if (Is<GoodData>(goodData)) {
                                        return changeGoodCategoryRequestAction(
                                            this._clientId,
                                            goodData.category_id.toString(),
                                            goodData.id,
                                            {
                                                ...goodData,
                                                category_id: Number(select.getValue()),
                                            },
                                            this._logger,
                                        );
                                    }
                                },
                            ],
                        })),
                    )
                        .finally(() => {
                            button.setLoading(false);
                            button.element.disabled    = true;
                            button.element.textContent = 'Завершено';
                        });
                }
            },
        });

        this._content.add(select);
        this._content.add(button);
    }

    private async _getSelectedGoods () {
        return getSelectedGoodsIdsDomAction(document);
    }
}