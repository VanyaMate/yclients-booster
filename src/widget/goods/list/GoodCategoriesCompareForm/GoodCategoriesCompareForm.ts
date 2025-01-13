import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    getGoodsCategoriesFullDataRequestAction,
} from '@/action/goods/list/request-actions/getGoodsCategoriesFullData.request-action.ts';
import {
    goodCategoriesFullListToCopyDataConverter,
} from '@/action/goods/list/converter/goodCategoriesFullListToCopyData/goodCategoriesFullListToCopyData.converter.ts';
import {
    GoodCategoriesCompareComponent,
} from '@/widget/goods/list/GoodCategoriesCompareComponent/GoodCategoriesCompareComponent.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    GoodCategoryDropdownActions,
} from '@/widget/goods/list/GoodCategoryDropdownActions/GoodCategoryDropdownActions.ts';


export type GoodCategoriesCompareFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class GoodCategoriesCompareForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger;
    private readonly _content: Col;

    constructor (props: GoodCategoriesCompareFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);

        this._clientId = clientId;
        this._bearer   = bearer;
        this._logger   = new Logger({});
        this._content  = new Col({ rows: [ this._logger ] });
        this._content.insert(this.element, 'afterbegin');

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const targetClientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID клиента',
        });

        const compareButton = new Button({
            textContent: 'Сравнить',
            onclick    : () => {
                const targetClientId = targetClientIdInput.getValue().trim();
                if (targetClientId) {
                    targetClientIdInput.remove();
                    compareButton.remove();
                    this._renderCompareForm(targetClientId);
                }
            },
        });

        this._content.add(targetClientIdInput);
        this._content.add(compareButton);
    }

    private async _renderCompareForm (targetClientId: string) {
        const targetData = await getGoodsCategoriesFullDataRequestAction(this._bearer, targetClientId, this._logger);
        const clientData = await getGoodsCategoriesFullDataRequestAction(this._bearer, this._clientId, this._logger);

        const targetList     = goodCategoriesFullListToCopyDataConverter(targetData).list;
        const clientCopyData = goodCategoriesFullListToCopyDataConverter(clientData).list;

        const categoriesCompareComponent = new GoodCategoriesCompareComponent({
            clientId        : this._clientId,
            bearer          : this._bearer,
            logger          : this._logger,
            fetcher         : new MemoFetch(),
            targetCategories: targetList,
            clientCategories: clientCopyData,
        });

        const compareButton = new Button({
            textContent: 'Преобразовать',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : () => {
                compareButton.setLoading(true);
                categoriesCompareComponent.getAction()()
                    .finally(() => {
                        const refreshButton = new Button({
                            textContent: 'Обновить данные',
                            styleType  : ButtonStyleType.DANGER,
                            onclick    : () => {
                                col.remove();
                                this._logger.reset();
                                this._renderCompareForm(targetClientId);
                            },
                        });

                        refreshButton.insert(compareButton.element, 'beforebegin');
                        compareButton.remove();
                    });
            },
        });

        const actions = new Row({
            cols: [
                new GoodCategoryDropdownActions({ compareEntity: categoriesCompareComponent }),
            ],
        });

        const col = new Col({
            rows: [
                new LabelDivider({ textContent: 'Управление' }),
                compareButton,
                new LabelDivider({ textContent: 'Массовые действия' }),
                actions,
                new LabelDivider({ textContent: 'Форма сравнения' }),
                categoriesCompareComponent,
            ],
        });

        this._content.add(col);
    }
}