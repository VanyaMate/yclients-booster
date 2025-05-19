import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import {
    getFinancesSuppliersRequestAction,
} from '@/action/finances/suppliers/request-actions/getFinancesSuppliers.request-action.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';
import {
    FinancesSupplier,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import {
    CopyFinancesSuppliersCompareComponent,
} from '@/widget/finances/suppliers/CopyFinancesSuppliersCompareComponent/CopyFinancesSuppliersCompareComponent.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import {
    FinancesSuppliersCompareDropdownActions,
} from '@/widget/finances/suppliers/FinancesSuppliersCompareDropdownActions/FinancesSuppliersCompareDropdownActions.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';


export type CopyFinancesSuppliersModalProps = {
    clientId: string;
}

export class CopyFinancesSuppliersModal extends ModalButton {
    private readonly _clientId: string;
    private readonly _logger: Logger    = new Logger({});
    private readonly _content: Col;
    private readonly _fetcher: IFetcher = new MemoFetch();
    private _targetClientId: string     = '';

    constructor (props: CopyFinancesSuppliersModalProps) {
        const { clientId } = props;
        const content      = new Col({ rows: [] });
        super({
            textContent: 'Копировать сюда',
            styleType  : ButtonStyleType.DEFAULT,
            modalProps : {
                label      : 'Копировать контрагентов',
                content,
                preferWidth: Modal.getPreferWidthByNesting(1),
            },
        });
        this._clientId = clientId;
        this._content  = content;
        this._content.add(this._logger);

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const targetClientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала откуда копировать',
            value      : this._targetClientId,
        });

        const getDataButton = new Button({
            textContent: 'Получить данные',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : async () => {
                getDataButton.setLoading(true);
                targetClientIdInput.setDisable(true);

                const clientSuppliers = await getFinancesSuppliersRequestAction(this._clientId, this._logger);
                const targetSuppliers = await getFinancesSuppliersRequestAction(this._targetClientId = targetClientIdInput.getValue(), this._logger);

                getDataButton.remove();
                targetClientIdInput.remove();

                this._renderCompareForm(clientSuppliers, targetSuppliers);
            },
        });

        this._content.add(targetClientIdInput);
        this._content.add(getDataButton);
    }

    private _renderCompareForm (clientSuppliers: Array<FinancesSupplier>, targetSuppliers: Array<FinancesSupplier>) {
        const executeActionsButton = new Button({
            styleType  : ButtonStyleType.PRIMARY,
            textContent: 'Преобразовать',
            onclick    : () => {
                executeActionsButton.setLoading(true);
                compareComponent.getAction()()
                    .finally(() => {
                        executeActionsButton.setLoading(false);
                        executeActionsButton.element.textContent = 'Заново';
                        executeActionsButton.element.onclick     = () => {
                            this._content.clear();
                            this._logger.reset();
                            this._content.add(this._logger);
                            this._renderInitialForm();
                        };
                    });
            },
        });

        const compareComponent = new CopyFinancesSuppliersCompareComponent({
            clientId: this._clientId,
            logger  : this._logger,
            fetcher : this._fetcher,
            clientSuppliers,
            targetSuppliers,
        });

        this._content.add(new LabelDivider({ textContent: 'Управление' }));
        this._content.add(executeActionsButton);
        this._content.add(new LabelDivider({ textContent: 'Массовые действия' }));
        this._content.add(new FinancesSuppliersCompareDropdownActions({ compareEntity: compareComponent }));
        this._content.add(new LabelDivider({ textContent: 'Форма сравнения' }));
        this._content.add(compareComponent);
    }
}