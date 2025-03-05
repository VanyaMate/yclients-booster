import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    getSalaryCriteriaListDataForCopyRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaListDataForCopy/getSalaryCriteriaListDataForCopy.request-action.ts';
import {
    SalaryCriteriaListCompareComponent,
} from '@/widget/salary_criteria/SalaryCriteriaListCompareComponent/SalaryCriteriaListCompareComponent.ts';


export type SalaryCriteriaListCompareFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    }

export class SalaryCriteriaListCompareForm extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _content: Col;
    private readonly _clientId: string;
    private readonly _bearer: string;

    constructor (props: SalaryCriteriaListCompareFormProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);

        this._clientId = clientId;
        this._bearer   = bearer;

        this._logger  = new Logger({});
        this._content = new Col({
            rows: [
                this._logger,
            ],
        });

        this._content.insert(this.element, 'afterbegin');
        this._renderForm();
    }

    private _renderForm () {
        const inputTargetId = new TextInput({
            type       : 'text',
            placeholder: 'ID клиента',
        });

        const compareButton = new Button({
            styleType  : ButtonStyleType.DEFAULT,
            textContent: 'Сравнить',
            onclick    : () => {
                const targetId = inputTargetId.getValue();
                if (targetId.trim()) {
                    inputTargetId.remove();
                    compareButton.remove();
                    this._renderCompareForm(targetId);
                }
            },
        });

        this._content.add(inputTargetId);
        this._content.add(compareButton);
    }

    private async _renderCompareForm (targetClientId: string) {
        const clientCopyData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, this._clientId, false, false, 5, 2, this._logger);
        const targetCopyData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, targetClientId, false, false, 5, 2, this._logger);

        const compareComponentList = new SalaryCriteriaListCompareComponent({
            clientId      : this._clientId,
            bearer        : this._bearer,
            targetCopyData: targetCopyData,
            clientCopyData: clientCopyData,
        });

        const actionButton = new Button({
            textContent: 'Преобразовать',
            onclick    : () => {
                actionButton.setLoading(true);
                compareComponentList.getAction()()
                    .finally(() => {
                        actionButton.setLoading(false);
                    });
            },
        });

        this._content.add(compareComponentList);
        this._content.add(actionButton);
    }
}