import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import {
    getFinancesExpensesListRequestAction,
} from '@/action/finances/expenses/request-actions/getFinancesExpensesList.request-action.ts';
import {
    FinancesExpense,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';
import {
    CopyFinancesExpensesCompareComponent,
} from '@/widget/finances/expenses/CopyFinancesExpensesCompareComponent/CopyFinancesExpensesCompareComponent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import {
    CopyFinancesExpensesDropdownActions,
} from '@/widget/finances/expenses/CopyFinancesExpensesDropdownActions/CopyFinancesExpensesDropdownActions.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export type CopyFinancesExpenseModalProps = {
    clientId: string;
}

export class CopyFinancesExpenseModal extends ModalButton {
    private readonly _clientId: string;
    private readonly _logger: Logger    = new Logger({});
    private readonly _content: Col;
    private readonly _fetcher: IFetcher = new MemoFetch();
    private _targetClientId: string     = '';

    constructor (props: CopyFinancesExpenseModalProps) {
        const { clientId } = props;
        const content      = new Col({ rows: [] });

        super({
            textContent: 'Копировать сюда',
            styleType  : ButtonStyleType.DEFAULT,
            modalProps : {
                label      : 'Копировать сюда',
                content,
                preferWidth: Modal.getPreferWidthByNesting(1),
            },
        });

        this._clientId = clientId;
        this._content  = content;

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        this._content.clear();
        this._logger.reset();
        this._content.add(this._logger);

        const targetClientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID клиента',
        });
        const getDataButton       = new Button({
            textContent: 'Получить данные',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : async () => {
                getDataButton.setLoading(true);
                this._renderCompareFormByTargetClientId(this._targetClientId = targetClientIdInput.getValue());
            },
        });

        this._content.add(targetClientIdInput);
        this._content.add(getDataButton);
    }

    private _renderCompareForm (targetData: Array<FinancesExpense>, clientData: Array<FinancesExpense>) {
        this._content.clear();
        this._content.add(this._logger);

        const executeActionsButton = new Button({
            textContent: 'Преобразовать',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : () => {
                executeActionsButton.setLoading(true);
                compareComponent.getAction()().finally(() => {
                    executeActionsButton.setLoading(false);
                    executeActionsButton.element.textContent = 'Обновить';
                    executeActionsButton.element.onclick     = () => {
                        executeActionsButton.setLoading(true);
                        this._renderCompareFormByTargetClientId(this._targetClientId);
                    };
                });
            },
        });

        const compareComponent = new CopyFinancesExpensesCompareComponent({
            clientId      : this._clientId,
            fetcher       : this._fetcher,
            logger        : this._logger,
            targetExpenses: targetData,
            clientExpenses: clientData,
        });

        this._content.add(new LabelDivider({ textContent: 'Массовые действия' }));
        this._content.add(new CopyFinancesExpensesDropdownActions({ compareEntity: compareComponent }));
        this._content.add(new LabelDivider({ textContent: 'Управление' }));
        this._content.add(executeActionsButton);
        this._content.add(new LabelDivider({ textContent: 'Форма сравнения' }));
        this._content.add(compareComponent);
    }

    private async _renderCompareFormByTargetClientId (targetClientId: string) {
        const targetData = await getFinancesExpensesListRequestAction(targetClientId, this._logger);
        const clientData = await getFinancesExpensesListRequestAction(this._clientId, this._logger);

        this._renderCompareForm(targetData, clientData);
    }
}