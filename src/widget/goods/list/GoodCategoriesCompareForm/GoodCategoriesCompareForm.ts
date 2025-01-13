import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
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
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';


export type GoodCategoriesCompareFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class GoodCategoriesCompareForm extends Component<HTMLDivElement> {
    private readonly _cleintId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger;
    private readonly _content: Col;
    private readonly _fetcher: IFetcher;

    constructor (props: GoodCategoriesCompareFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);

        this._cleintId = clientId;
        this._bearer   = bearer;
        this._logger   = new Logger({});
        this._fetcher  = new MemoFetch();
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
        const clientData = await getGoodsCategoriesFullDataRequestAction(this._bearer, this._cleintId, this._logger);

        const targetList     = goodCategoriesFullListToCopyDataConverter(targetData).list;
        const clientCopyData = goodCategoriesFullListToCopyDataConverter(clientData).list;

        this._content.add(
            new GoodCategoriesCompareComponent({
                clientId        : this._cleintId,
                bearer          : this._bearer,
                logger          : this._logger,
                fetcher         : this._fetcher,
                targetCategories: targetList,
                clientCategories: clientCopyData,
            }),
        );
    }
}