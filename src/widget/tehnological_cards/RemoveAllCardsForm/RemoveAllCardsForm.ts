import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    RemoveCardInfo,
} from '@/widget/tehnological_cards/RemoveAllCardsModalButton/RemoveAllCardsModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    removeTechnologicalCardRequestAction,
} from '@/action/technological_cards/removeTechnologicalCard.request-action.ts';


export type RemoveAllCardsFormProps =
    {
        clientId: string;
    }
    & ComponentPropsOptional<HTMLDivElement>;

export class RemoveAllCardsForm extends Component<HTMLDivElement> {
    private _currentSelectedIds: Set<string> = new Set();
    private _logger                          = new Logger({});
    private _content                         = new Col({ rows: [] });
    private _isRemoving: boolean             = false;
    private _clientId: string                = '';

    constructor (props: RemoveAllCardsFormProps) {
        const { clientId, ...other } = props;
        super('div', other);

        this._clientId = clientId;
        this._content.insert(this.element, 'beforeend');
        this._content.add(this._logger);
        this._content.add(this._getForm());
    }

    private _getCardsInfo (): Array<RemoveCardInfo> {
        const table = document.querySelector('.page-table');
        if (!table) return [];

        const rows = table.querySelectorAll('.client-box');

        return [ ...rows ]
            .map((row) => {
                const link  = row.querySelector<HTMLAnchorElement>('.project-actions > a');
                const title = row.querySelector<HTMLLIElement>(`.project-title > a`);
                if (title && link) {
                    return {
                        id   : link.href.split('/').slice(-1)[0],
                        title: title.textContent?.trim() ?? '[Неизвестный]',
                    };
                }

                return {
                    id   : '',
                    title: '',
                };
            })
            .filter((item) => item.id.length > 0);
    }

    private _getCardSelectForm (list: Array<RemoveCardInfo>): Array<CheckboxWithLabel> {
        return list.map((item) => {
            const checkbox = new CheckboxWithLabel({
                label      : item.title,
                labelPrefix: item.id,
                checked    : false,
                value      : item.id,
                onchange   : (event) => {
                    if (this._isRemoving) {
                        event.preventDefault();
                        return;
                    }

                    if (checkbox.element.checked) {
                        this._currentSelectedIds.add(item.id);
                    } else {
                        this._currentSelectedIds.delete(item.id);
                    }
                },
            });

            return checkbox;
        });
    }

    private _toggleAllAsChecked (checkboxes: Array<CheckboxWithLabel>) {
        checkboxes.forEach((checkbox) => checkbox.setChecked(true));
    }

    private _toggleAllAsUnchecked (checkboxes: Array<CheckboxWithLabel>) {
        checkboxes.forEach((checkbox) => checkbox.setChecked(false));
    }

    private _getToggleAsCheckedButton (checkboxes: Array<CheckboxWithLabel>) {
        return new Button({
            textContent: 'Выделить все',
            onclick    : () => this._toggleAllAsChecked(checkboxes),
        });
    }

    private _getToggleAsUncheckedButton (checkboxes: Array<CheckboxWithLabel>) {
        return new Button({
            textContent: 'Отменить выделение',
            onclick    : () => this._toggleAllAsUnchecked(checkboxes),
        });
    }

    private _removeCurrentSelectedCards (checkboxes: Array<CheckboxWithLabel>) {
        this._isRemoving = true;

        const promiseSplitter = new PromiseSplitter(5, 1);

        checkboxes.forEach((checkbox) => !checkbox.getState() && checkbox.remove());
        const selectedCheckboxes: Array<CheckboxWithLabel> = checkboxes.filter((checkbox) => checkbox.getState());
        selectedCheckboxes.forEach((checkbox) => checkbox.setChecked(false));
        selectedCheckboxes.forEach((checkbox) => checkbox.setDisable(true));

        return promiseSplitter
            .exec(selectedCheckboxes
                .map((checkbox) => ({
                    chain    : [
                        () => removeTechnologicalCardRequestAction(this._clientId, checkbox.getValue(), this._logger),
                    ],
                    onSuccess: () => checkbox.setChecked(true),
                    onError  : () => checkbox.setChecked(false),
                    onBefore : () => {
                        checkbox.setDisable(false);
                    },
                    onFinally: () => checkbox.setDisable(true),
                })));
    }

    private _getRemoveButton (checkboxes: Array<CheckboxWithLabel>) {
        const button = new Button({
            textContent: 'Удалить выбранные',
            onclick    : () => {
                button.setLoading(true);
                button.element.textContent = 'Удаление..';
                this._removeCurrentSelectedCards(checkboxes).finally(() => {
                    button.element.textContent = 'Удалено';
                    button.setLoading(false);
                    button.element.disabled = true;
                });
            },
            styleType  : ButtonStyleType.DANGER,
        });

        return button;
    }

    private _getForm () {
        const cards                = this._getCardsInfo();
        const checkboxes           = this._getCardSelectForm(cards);
        const checkAllButton       = this._getToggleAsCheckedButton(checkboxes);
        const uncheckAllButton     = this._getToggleAsUncheckedButton(checkboxes);
        const removeSelectedButton = this._getRemoveButton(checkboxes);
        const listDivider          = new LabelDivider({ textContent: 'Список всех карточек' });
        const removeDivider        = new LabelDivider({ textContent: 'Подтверждение' });
        const content              = new Col({
            rows: [ listDivider, ...checkboxes ],
        });
        content.add(checkAllButton);
        content.add(uncheckAllButton);
        content.add(removeDivider);
        content.add(removeSelectedButton);
        return content;
    }
}