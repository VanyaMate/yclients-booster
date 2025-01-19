import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    GroupLoyaltyAbonementActivation,
    GroupLoyaltyAbonementActivationType,
    GroupLoyaltyAbonementAddItem,
    GroupLoyaltyAbonementFreezing,
    GroupLoyaltyAbonementSalonChangeType,
    GroupLoyaltyAbonementServiceAmount,
    GroupLoyaltyAbonementTimeUnit,
    GroupLoyaltyAbonementTimeUnitType,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/types/mass-add-form.types.ts';
import { isNull } from '@vanyamate/types-kit';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import {
    GroupLoyaltyAbonementActionComponent,
} from '@/widget/net/group_loyalty_abonement/GroupLayaltyAbonementActionComponent/GroupLoyaltyAbonementActionComponent.ts';


export type GroupLoyaltyAbonementMassAddFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    }

export class GroupLoyaltyAbonementMassAddForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _logger: Logger           = new Logger({});
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });
    private _content: Col;

    constructor (props: GroupLoyaltyAbonementMassAddFormProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._content  = new Col({ rows: [ this._progressBar, this._logger ] });
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();

        // add textarea
        // add button

        // add list of items
        // add button

        // show process
    }

    private _renderInitialForm () {
        const dataTextarea = new TextArea({
            placeholder: `Введите строку в формате`,
        });

        const noCreateSimilarRowsCheckbox = new CheckboxWithLabel({
            label: 'Не создавать если с таким заголовком уже создано',
        });

        const autoSetClientIdsCheckbox = new CheckboxWithLabel({
            label: 'Автоматически установить все филиалы',
        });

        const acceptButton = new Button({
            textContent: 'Проверить',
            onclick    : () => {
                noCreateSimilarRowsCheckbox.remove();
                autoSetClientIdsCheckbox.remove();
                dataTextarea.remove();
                acceptButton.remove();

                const noCreateSimilar  = noCreateSimilarRowsCheckbox.getState();
                const autoSetClientIds = autoSetClientIdsCheckbox.getState();
                const data             = dataTextarea.getValue();
                const rows             = this._parseTextareaValue(data);

                const clientIds = autoSetClientIds ? [] : null;

                if (!isNull(clientIds)) {
                    rows.forEach((row) => row.salonIds = clientIds);
                }

                if (noCreateSimilar) {
                    // upload current
                    const currentAbonements: Array<string> = [];
                    return this._renderRowsForm(rows.filter((row) => !currentAbonements.includes(row.title)));
                }

                return this._renderRowsForm(rows);
            },
        });

        this._content.add(dataTextarea);
        this._content.add(autoSetClientIdsCheckbox);
        this._content.add(noCreateSimilarRowsCheckbox);
        this._content.add(acceptButton);
    }

    private _renderRowsForm (rows: Array<GroupLoyaltyAbonementAddItem>) {
        rows.forEach((row) => {
            this._content.add(
                new GroupLoyaltyAbonementActionComponent({
                    data    : row,
                    clientId: this._clientId,
                }),
            );
        });
        this._content.add(new Button({ textContent: 'Добавить' }));
    }

    private _parseTextareaValue (value: string): Array<GroupLoyaltyAbonementAddItem> {
        const rows = this._getRows(value);

        return rows.map((row) => {
            const [
                      title,
                      price,
                      validityPeriod,
                      freezing,
                      activation,
                      visitAmount,
                      categories,
                      services,
                      recalculateAfterPayment,
                      isNamedType,
                      online,
                      salonIds,
                      salonChangeType,
                  ] = this._getCols(row);


            const visitAmountValue = this._getVisitNumber(visitAmount);

            return {
                title                  : this._getTitle(title),
                price                  : this._getPrice(price),
                validityPeriod         : this._getValidityPeriod(validityPeriod),
                freezing               : this._getFreezing(freezing),
                activation             : this._getActivation(activation),
                visitAmount            : visitAmountValue,
                categories             : this._getCategories(categories, visitAmountValue),
                services               : this._getServices(services, visitAmountValue),
                recalculateAfterPayment: this._getRecalculateAfterPayment(recalculateAfterPayment),
                isNamedType            : this._getIsNamedType(isNamedType),
                online                 : this._getOnline(online),
                salonIds               : this._getSalonIds(salonIds),
                salonChangeType        : this._getSalonChangeType(salonChangeType),
            };
        });
    }

    private _getRows (value: string): Array<string> {
        return value.split(/\n/gi);
    }

    private _getCols (value: string): Array<string> {
        return value.split(/\t/gi);
    }

    private _getTitle (value: string): string {
        return value.trim();
    }

    private _getPrice (value: string): number {
        const [ _, price ] = value.match(/(\d+)/) ?? [];
        if (price) {
            return Number(price);
        }

        throw new Error(`"${ value }" не валидная цена`);
    }

    private _getValidityPeriod (value: string): GroupLoyaltyAbonementTimeUnit {
        return this._getTimeUnit(value);
    }

    private _getFreezing (value: string): GroupLoyaltyAbonementFreezing | null {
        const [ status, time, online ] = value.split('-');

        switch (status.trim().toLowerCase()) {
            case 'да':
                const timeUnit = this._getTimeUnit(time);
                return {
                    time        : timeUnit,
                    bookingAllow: !!online,
                    unlimited   : timeUnit.amount === 0,
                };
            case 'нет':
                return null;
            default:
                throw new Error(`"${ value }" не валидное значение для заморозки`);
        }
    }

    private _getActivation (value: string): GroupLoyaltyAbonementActivation {
        const [ type, time ] = value.split('-');
        switch (type.trim().toLowerCase()) {
            case 'продажа':
                return {
                    type: GroupLoyaltyAbonementActivationType.PURCHASE,
                    time: null,
                };
            case 'посещение':
                if (time) {
                    return {
                        type: GroupLoyaltyAbonementActivationType.VISIT,
                        time: this._getTimeUnit(time),
                    };
                } else {
                    return {
                        type: GroupLoyaltyAbonementActivationType.VISIT,
                        time: null,
                    };
                }
            case 'дата':
                return {
                    type: GroupLoyaltyAbonementActivationType.DATE,
                    time: null,
                };
            default:
                throw new Error(`"${ value }" не валидное значение для активации`);
        }
    }

    private _getVisitNumber (value: string): number | null {
        if (value === 'нет') {
            return null;
        }

        const amount = Number(value);
        if (amount) {
            return amount;
        }

        throw new Error(`"${ value }" не валидное значение для количества посещений`);
    }

    private _getCategories (value: string, visitNumber: number | null): Array<GroupLoyaltyAbonementServiceAmount> {
        const categories = value.split(',');
        return categories.map((category) => {
            const [ categoryId, amount ] = category.split('-');

            if (categoryId) {
                const count = Number(amount);
                if (isNull(visitNumber)) {
                    if (count) {
                        return {
                            categoryId: categoryId,
                            serviceId : '0',
                            count     : count,
                        };
                    }

                    throw new Error(`"${ amount }" внутри "${ category }" внутри "${ value }" является не валидным количеством`);
                }

                return {
                    categoryId: categoryId,
                    serviceId : '0',
                    count     : 0,
                };
            }

            throw new Error(`"${ category }" внутри "${ value }" не является валидной категорией`);
        });
    }

    private _getServices (value: string, visitNumber: number | null): Array<GroupLoyaltyAbonementServiceAmount> {
        const items = value.split(',');
        return items.map((item) => {
            const [ categoryId, serviceId, amount ] = item.split('-');

            if (categoryId && serviceId) {
                const count = Number(amount);
                if (isNull(visitNumber)) {
                    if (count) {
                        return {
                            categoryId: categoryId,
                            serviceId : serviceId,
                            count     : count,
                        };
                    }

                    throw new Error(`"${ amount }" внутри "${ item }" внутри "${ value }" является не валидным количеством`);
                }

                return {
                    categoryId: categoryId,
                    serviceId : serviceId,
                    count     : 0,
                };
            }

            throw new Error(`"${ item }" внутри "${ value }" не является валидой услугой`);
        });
    }

    private _getRecalculateAfterPayment (value: string): boolean {
        return this._getYesOrNoBool(value);
    }

    private _getIsNamedType (value: string): boolean {
        return this._getYesOrNoBool(value);
    }

    private _getOnline (value: string): boolean {
        return this._getYesOrNoBool(value);
    }

    private _getSalonIds (value: string): Array<string> {
        return value.split(',');
    }

    private _getSalonChangeType (value: string): GroupLoyaltyAbonementSalonChangeType {
        switch (value) {
            case 'нет':
                return GroupLoyaltyAbonementSalonChangeType.NONE;
            case 'гдепродан':
                return GroupLoyaltyAbonementSalonChangeType.PURCHASE;
            case 'везде':
                return GroupLoyaltyAbonementSalonChangeType.ALL;
            default:
                throw new Error(`"${ value }" не является валидным значением`);
        }
    }

    private _getYesOrNoBool (value: string): boolean {
        switch (value.trim().toLowerCase()) {
            case 'да':
                return true;
            case 'нет':
                return false;
            default:
                throw new Error(`"${ value }" не валидное значение`);
        }
    }

    private _getTimeUnit (value: string): GroupLoyaltyAbonementTimeUnit {
        if (value.trim().toLowerCase() === 'неогр') {
            return {
                amount: 0,
                type  : GroupLoyaltyAbonementTimeUnitType.DAY,
            };
        }

        const [ _, amount, type ] = value.match(/(\d+)(.+)/) ?? [];
        const amountNumber        = Number(amount);
        if (amountNumber && type) {
            switch (type) {
                case 'д':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyAbonementTimeUnitType.DAY,
                    };
                case 'н':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyAbonementTimeUnitType.WEEK,
                    };
                case 'м':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyAbonementTimeUnitType.MONTH,
                    };
                case 'г':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyAbonementTimeUnitType.YEAR,
                    };
                default:
                    throw new Error(`"${ value }" не валидное значение`);
            }
        }

        throw new Error(`"${ value }" не валидное значение времени`);
    }
}