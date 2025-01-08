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
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    SettingsServiceCategoryDropdownActions,
} from '@/widget/settings/service/SettingsServiceCategoryDropdownActions/SettingsServiceCategoryDropdownActions.ts';
import {
    SettingsServiceDropdownActions,
} from '@/widget/settings/service/SettingsServiceDropdownActions/SettingsServiceDropdownActions.ts';
import {
    ResourceDropdownActions,
} from '@/widget/resources/ResourceDropdownActions/ResourceDropdownActions.ts';
import {
    ResourceInstanceDropdownActions,
} from '@/widget/resources/ResourceInstanceDropdownActions/ResourceInstanceDropdownActions.ts';


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
                new LabelDivider({
                    textContent: 'Логгер',
                }),
                logger,
            ],
        });

        const activateButton = new Button({
            styleType  : ButtonStyleType.PRIMARY,
            textContent: 'Преобразовать',
            onclick    : () => {
                activateButton.setLoading(true);
                headerActions.remove();
                form.getAction()()
                    .finally(() => {
                        logger.log(`завершено`);
                        new Button({
                            textContent: 'Обновить данные',
                            styleType  : ButtonStyleType.DANGER,
                            onclick    : () => {
                                this._renderCompareForm(targetClientId);
                            },
                        })
                            .insert(activateButton.element, 'afterend');

                        activateButton.remove();
                    });
            },
        });

        content.insert(this.element, 'afterbegin');

        const clientData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, this._clientId, true, false, 5, 1, logger);
        const targetData = await getSalaryCriteriaListDataForCopyRequestAction(this._bearer, targetClientId, true, false, 5, 1, logger);

        const form = new SettingsServiceCategoriesCompareComponent({
            clientId  : this._clientId,
            bearer    : this._bearer,
            targetData: targetData.settingsCopyData,
            clientData: clientData.settingsCopyData,
            logger    : logger,
            fetcher   : fetcher,
        });

        const headerActions = new Col({
            rows: [
                new LabelDivider({
                    textContent: 'Массовые действия',
                }),
                new Row({
                    cols: [
                        new SettingsServiceCategoryDropdownActions({ compareEntity: form }),
                        new SettingsServiceDropdownActions({ compareEntity: form }),
                        new ResourceDropdownActions({ compareEntity: form }),
                        new ResourceInstanceDropdownActions({ compareEntity: form }),
                    ],
                }),
            ],
        });

        content.add(
            new LabelDivider({
                textContent: 'Управление',
            }),
        );
        content.add(activateButton);
        content.add(headerActions);
        content.add(
            new LabelDivider({
                textContent: 'Форма сравнения',
            }),
        );
        content.add(form);
    }
}