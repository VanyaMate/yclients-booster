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
    GroupLoyaltyAbonementFreezing, GroupLoyaltyAbonementOnline,
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
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    getGroupLoyaltyAmonements,
} from '@/action/net/group-loyalty-abonement/getGroupLoyaltyAmonements.ts';


export type GroupLoyaltyAbonementMassAddFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    }

export class GroupLoyaltyAbonementMassAddForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger: Logger           = new Logger({});
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });
    private _content: Col;

    constructor (props: GroupLoyaltyAbonementMassAddFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;
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
        this._logger.reset();

        const dataTextarea = new TextArea({
            placeholder : `Введите строку в формате`,
            preferHeight: 300,
        });

        const noCreateSimilarRowsCheckbox = new CheckboxWithLabel({
            label: 'Не создавать если с таким заголовком уже создано',
        });

        const acceptButton = new Button({
            textContent: 'Проверить',
            onclick    : async () => {
                noCreateSimilarRowsCheckbox.remove();
                dataTextarea.remove();
                acceptButton.remove();

                const noCreateSimilar = noCreateSimilarRowsCheckbox.getState();
                const data            = dataTextarea.getValue();
                const rows            = this._parseTextareaValue(data);

                if (noCreateSimilar) {
                    // upload current
                    const currentAbonements: Array<string> = (await getGroupLoyaltyAmonements(this._bearer, this._clientId, 1, this._logger)).map((abonement) => abonement.title);
                    return this._renderRowsForm(rows.filter((row) => !currentAbonements.includes(row.title)));
                }

                return this._renderRowsForm(rows);
            },
        });

        this._content.add(dataTextarea);
        this._content.add(noCreateSimilarRowsCheckbox);
        this._content.add(acceptButton);
    }

    private _renderRowsForm (rows: Array<GroupLoyaltyAbonementAddItem>) {
        if (!rows.length) {
            const text   = new Component<HTMLDivElement>('div', {
                textContent: `Ничего не добавлено или все абонементы уже созданы`,
            });
            const button = new Button({
                textContent: 'Добавить заново',
                onclick    : () => {
                    text.remove();
                    button.remove();
                    this._renderInitialForm();
                },
            });

            this._content.add(text);
            this._content.add(button);

            return;
        }

        const actionComponents = rows.map((row) => {
            const component = new GroupLoyaltyAbonementActionComponent({
                data    : row,
                clientId: this._clientId,
                bearer  : this._bearer,
                logger  : this._logger,
            });

            this._content.add(component);
            return component;
        });


        let successAmount = 0;
        let errorAmount   = 0;

        this._progressBar.reset(actionComponents.length);

        const createButton = new Button({
            textContent: 'Добавить',
            onclick    : () => {
                createButton.setLoading(true);
                new PromiseSplitter(1, PROMISE_SPLITTER_MAX_RETRY)
                    .exec<void>(
                        actionComponents.map((component) => ({
                            chain    : [ component.getAction() ],
                            onSuccess: () => {
                                this._progressBar.setLeftProgress(++successAmount);
                            },
                            onError  : () => {
                                this._progressBar.setRightProgress(++errorAmount);
                            },
                        })),
                    )
                    .finally(() => {
                        createButton.setLoading(false);
                        createButton.element.disabled    = true;
                        createButton.element.textContent = 'Закончено';
                    });
            },
        });

        this._content.add(createButton);
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
                      onlineTitle,
                      onlinePrice,
                      onlineDescription,
                      onlineImage,
                      salonIds,
                      salonChangeType,
                  ] = this._getCols(row);

            try {
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
                    online                 : this._getOnline(online, onlineTitle, onlinePrice, onlineDescription, onlineImage),
                    salonIds               : this._getSalonIds(salonIds),
                    salonChangeType        : this._getSalonChangeType(salonChangeType),
                };
            } catch (e: unknown) {
                this._logger.error(`ошибка заполнения формы. ${ (e as Error).message }`);

                const button = new Button({
                    textContent: 'Попробовать заново',
                    onclick    : () => {
                        button.remove();
                        this._renderInitialForm();
                    },
                });

                this._content.add(button);
                throw e;
            }
        });
    }

    private _getRows (value: string): Array<string> {
        return value.split(/\n/gi).filter(Boolean);
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
        return categories.filter(Boolean).map((category) => {
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
        return items.filter(Boolean).map((item) => {
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

    private _getOnline (yesOrNoValue: string, titleValue: string, priceValue: string, descriptionValue: string, imageValue: string): GroupLoyaltyAbonementOnline {
        if (this._getYesOrNoBool(yesOrNoValue)) {
            return {
                title      : titleValue,
                price      : Number(priceValue),
                description: descriptionValue,
                image      : imageValue,
            };
        } else {
            return null;
        }
    }

    private _getSalonIds (value: string): Array<string> {
        return value.split(',').filter(Boolean);
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