import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import {
    getLabelsClientRequestAction,
} from '@/action/labels/client/request-action/getLabelsClient/getLabelsClient.request-action.ts';
import {
    LabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';
import {
    CompareLabelClient,
} from '@/widget/labels/client/CompareLabelClient/CompareLabelClient.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import css from './CopyLabelsClientForm.module.css';


export type CopyLabelsClientFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        promiseSplitter?: {
            limit?: number;
            retry?: number;
        }
    };

export class CopyLabelsClientForm extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _input: TextInput;
    private readonly _compareButton: Button;
    private readonly _clientId: string;
    private _col: Col;
    private _promiseSplitter: PromiseSplitter;

    constructor (props: CopyLabelsClientFormProps) {
        const { clientId, promiseSplitter, ...other } = props;
        super('div', other);
        this.element.classList.add(css.container);
        this._logger          = new Logger({});
        this._clientId        = clientId;
        this._promiseSplitter = new PromiseSplitter(
            promiseSplitter?.limit ?? PROMISE_SPLITTER_MAX_REQUESTS,
            promiseSplitter?.retry ?? PROMISE_SPLITTER_MAX_RETRY,
        );

        this._input         = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала откуда копировать',
        });
        this._compareButton = new Button({
            styleType: ButtonStyleType.PRIMARY,
            innerHTML: 'Сравнить',
            onclick  : this._onConfirmHandler.bind(this),
        });

        this._col = new Col({
            rows: [
                this._logger,
                this._input,
                this._compareButton,
            ],
        });

        this._col.insert(this.element, 'afterbegin');
    }

    private async _onConfirmHandler () {
        const id = this._input.getValue();
        if (id) {
            this._compareButton.remove();
            this._input.remove();
            const selfList = await getLabelsClientRequestAction(this._clientId, this._logger);
            const list     = await getLabelsClientRequestAction(id, this._logger);
            this._render(list, selfList);
        }
    }

    private _render (list: Array<LabelClientType>, selfList: Array<LabelClientType>) {
        const compareLabels: Array<CompareLabelClient> = [];
        let compareLabel: CompareLabelClient;
        list.forEach((label) => {
            compareLabel = new CompareLabelClient({
                copyLabel     : label,
                targetLabel   : selfList.find((selfLabel) => selfLabel.title === label.title),
                compareList   : selfList,
                targetClientId: this._clientId,
            });
            compareLabels.push(compareLabel);
            this._col.add(compareLabel);
        });

        const button = new Button({
            innerHTML: 'Подтвердить',
            styleType: ButtonStyleType.PRIMARY,
            onclick  : () => {
                button.setLoading(true);
                this._promiseSplitter.exec(
                    compareLabels.map(
                        (label) => ({ chain: label.getPromises() }),
                    ),
                )
                    .finally(() => button.setLoading(false));
            },
        });

        this._col.add(button);
    }
}