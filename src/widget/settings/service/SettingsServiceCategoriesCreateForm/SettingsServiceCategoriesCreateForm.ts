import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import {
    SettingsServiceCategoriesCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoriesCompareComponent/SettingsServiceCategoriesCompareComponent.ts';
import {
    getSalaryCriteriaListDataForCopyRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaListDataForCopy/getSalaryCriteriaListDataForCopy.request-action.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';


export type SettingsServiceCategoriesCreateFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class SettingsServiceCategoriesCreateForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;

    constructor (props: SettingsServiceCategoriesCreateFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const targetClientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID клиента',
        });

        const compareButton = new Button({
            styleType  : ButtonStyleType.DEFAULT,
            textContent: 'Сравнить',
            onclick    : () => {
                const id = targetClientIdInput.getValue();
                if (id) {

                    this._renderCompareForm(id);
                }
            },
        });

        new Col({
            rows: [
                targetClientIdInput,
                compareButton,
            ],
        })
            .insert(this.element, 'afterbegin');
    }

    private async _renderCompareForm (targetClientId: string) {
        this.element.innerHTML = ``;

        const logger  = new Logger({});
        const fetcher = new MemoFetch();
        const content = new Col({
            rows: [
                logger,
            ],
        });

        const activateButton = new Button({
            styleType  : ButtonStyleType.PRIMARY,
            textContent: 'Преобразовать',
            onclick    : () => {
                activateButton.setLoading(true);
                new PromiseSplitter(5, 2)
                    .exec(
                        form.getActions().map((action) => ({
                            chain: [ action ],
                        })),
                    )
                    .finally(() => {
                        activateButton.remove();
                        logger.log(`завершено`);

                        new Button({
                            textContent: 'Обновить данные',
                            styleType  : ButtonStyleType.DANGER,
                            onclick    : () => {
                                this._renderCompareForm(targetClientId);
                            },
                        })
                            .insert(form.element, 'beforebegin');
                    });
            },
        });

        content.insert(this.element, 'afterbegin');

        const clientData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, this._clientId, true, 5, 1, logger);
        const targetData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, targetClientId, true, 5, 1, logger);

        const form = new SettingsServiceCategoriesCompareComponent({
            clientId  : this._clientId,
            bearer    : this._bearer,
            targetData: targetData.settingsCopyData,
            clientData: clientData.settingsCopyData,
            logger    : logger,
            fetcher   : fetcher,
        });

        content.add(activateButton);
        content.add(form);
    }
}