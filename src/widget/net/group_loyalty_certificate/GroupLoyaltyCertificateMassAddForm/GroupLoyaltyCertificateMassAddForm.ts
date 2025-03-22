import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import {
    CheckboxWithLabel,
} from '@/shared/input/CheckboxWithLabel/CheckboxWithLabel.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import {
    GroupLoyaltyCertificateBalanceEditType,
    GroupLoyaltyCertificateDebitType,
    GroupLoyaltyCertificateExpirationType,
    GroupLoyaltyCertificateLimitationOfUse,
    GroupLoyaltyCertificateLimitationOfUseType,
    GroupLoyaltyCertificateMassAddItem, GroupLoyaltyCertificateOnline,
    GroupLoyaltyCertificateTerm,
    GroupLoyaltyCertificateTimeUnit,
    GroupLoyaltyCertificateTimeUnitType,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateMassAddForm/types/mass-add-certificate.types.ts';
import {
    getGroupLoyaltyCertificates,
} from '@/action/net/group-loyalty-certificate/request-action/getGroupLoyaltyCertificates.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    GroupLoyaltyCertificateActionComponent,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateActionComponent/GroupLoyaltyCertificateActionComponent.ts';
import { delay } from '@/helper/lib/delay/delay';


export type GroupLoyaltyCertificateMassAddFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        logger?: ILogger;
    };

export class GroupLoyaltyCertificateMassAddForm extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _logger: Logger           = new Logger({});
    private readonly _progressBar: ProgressBar = new ProgressBar({ max: 0 });
    private readonly _content: Col;

    constructor (props: GroupLoyaltyCertificateMassAddFormProps) {
        const { clientId, logger, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._content  = new Col({ rows: [ this._progressBar, this._logger ] });
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
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
                    const currentAbonements: Array<string> = (await getGroupLoyaltyCertificates(this._clientId, this._logger)).map((certificate) => certificate.title);
                    return this._renderRowsForm(rows.filter((row) => !currentAbonements.includes(row.title)));
                }

                return this._renderRowsForm(rows);
            },
        });

        this._content.add(dataTextarea);
        this._content.add(noCreateSimilarRowsCheckbox);
        this._content.add(acceptButton);
    }

    private _renderRowsForm (rows: Array<GroupLoyaltyCertificateMassAddItem>): void {
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
            const component = new GroupLoyaltyCertificateActionComponent({
                data    : row,
                clientId: this._clientId,
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
            onclick    : async () => {
			        if (actionComponents.length > 0) {
								const promiseSplitter = new PromiseSplitter(
									PROMISE_SPLITTER_MAX_REQUESTS,
									PROMISE_SPLITTER_MAX_RETRY,
								);
								createButton.setLoading(true);
			        
								// Создается сначала 1 для того, чтобы система успела создать категорию товаров системную
								await promiseSplitter.exec<void>(
									actionComponents.slice(0, 1).map((component) => ({
										chain: [component.getAction()],
										onSuccess: () => {
											this._progressBar.setLeftProgress(++successAmount);
										},
										onError: () => {
											this._progressBar.setRightProgress(++errorAmount);
										},
									})),
								);
			        
								// Ну и на всякий случай добавлю еще задержку в пол секунды
								await delay(500);
			        
								await promiseSplitter
									.exec<void>(
										actionComponents
											.slice(1, actionComponents.length)
											.map((component) => ({
												chain: [component.getAction()],
												onSuccess: () => {
													this._progressBar.setLeftProgress(++successAmount);
												},
												onError: () => {
													this._progressBar.setRightProgress(++errorAmount);
												},
											})),
									)
									.finally(() => {
										createButton.setLoading(false);
										createButton.element.disabled = true;
										createButton.element.textContent = "Закончено";
									});
							}
            },
        });

        this._content.add(createButton);
    }

    private _parseTextareaValue (value: string): Array<GroupLoyaltyCertificateMassAddItem> {
        const rows = this._getRows(value);

        return rows.map((row) => {
            const [
                      title,
                      type,
                      nominal,
                      limitationOfUse,
                      term,
                      allowEmptyCode,
                      balanceEdit,
                      online,
                      onlineTitle,
                      onlinePrice,
                      onlineDescription,
                      onlineImage,
                      salonIds,
                  ] = this._getCols(row);

            try {
                return {
                    title          : this._getTitle(title),
                    type           : this._getType(type),
                    nominal        : this._getNominal(nominal),
                    limitationOfUse: this._getLimitationOfUse(limitationOfUse),
                    term           : this._getTerm(term),
                    allowEmptyCode : this._getAllowEmptyCode(allowEmptyCode),
                    balanceEditType: this._getBalanceEditType(balanceEdit),
                    online         : this._getOnline(online, onlineTitle, onlinePrice, onlineDescription, onlineImage),
                    salonIds       : this._getSalonIds(salonIds),
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

    private _getType (value: string): GroupLoyaltyCertificateDebitType {
        switch (value) {
            case 'один':
                return GroupLoyaltyCertificateDebitType.ONE;
            case 'много':
                return GroupLoyaltyCertificateDebitType.MANY;
            default:
                throw new Error(`"${ value }" не является валидным значением для типа списания. (один, много)`);
        }
    }

    private _getNominal (value: string): number {
        return Number(value.trim());
    }

    private _getLimitationOfUse (value: string): GroupLoyaltyCertificateLimitationOfUse {
        const [ firstPart, secondPart ] = value.split('+');

        if (firstPart.match(/товары/)) {
            if (secondPart) {
                const [ _, idsString ] = secondPart.split(/услуги/);
                if (idsString !== undefined) {
                    const matches = idsString.match(/\((.+)\)/);
                    if (matches) {
                        const ids = matches[1].split(',');
                        return {
                            type    : GroupLoyaltyCertificateLimitationOfUseType.PART_OF_SERVICES_AND_GOODS,
                            services: ids,
                        };
                    }

                    return {
                        type    : GroupLoyaltyCertificateLimitationOfUseType.SERVICES_AND_GOODS,
                        services: [],
                    };
                }

                throw new Error(`"${ value }" не является валидным значением для ограничения применения. а именно "${ secondPart }"`);
            }

            return {
                type    : GroupLoyaltyCertificateLimitationOfUseType.GOODS,
                services: [],
            };
        }

        const [ _, idsString ] = firstPart.split(/услуги/);
        if (idsString !== undefined) {
            const matches = idsString.match(/\((.+)\)/);
            if (matches) {
                const ids = matches[1].split(',');
                return {
                    type    : GroupLoyaltyCertificateLimitationOfUseType.PART_OF_SERVICES,
                    services: ids,
                };
            }

            return {
                type    : GroupLoyaltyCertificateLimitationOfUseType.SERVICES,
                services: [],
            };
        }

        throw new Error(`"${ value }" не является валидным значением для ограничения применения`);
    }

    private _getTerm (value: string): GroupLoyaltyCertificateTerm {
        const [ type, valueOfTerm ] = value.split('-');
        switch (type) {
            case 'нет':
                return {
                    type: GroupLoyaltyCertificateExpirationType.NONE,
                    date: null,
                    time: null,
                };
            case 'дата':
                if (valueOfTerm.match(/\d+\.\d+\.\d+/)) {
                    return {
                        type: GroupLoyaltyCertificateExpirationType.DATE,
                        date: valueOfTerm,
                        time: null,
                    };
                }

                throw new Error(`формат даты в "${ value }" неверный`);
            case 'срок':
                return {
                    type: GroupLoyaltyCertificateExpirationType.TERM,
                    date: null,
                    time: this._getTimeUnit(valueOfTerm),
                };
            default:
                throw new Error(`"${ value }" не валидное значение для ограничения срока действия`);
        }
    }

    private _getAllowEmptyCode (value: string): boolean {
        return this._getYesOrNoBool(value);
    }

    private _getBalanceEditType (value: string): GroupLoyaltyCertificateBalanceEditType {
        switch (value) {
            case 'нет':
                return GroupLoyaltyCertificateBalanceEditType.NONE;
            case 'гдепродан':
                return GroupLoyaltyCertificateBalanceEditType.PURCHASE;
            case 'везде':
                return GroupLoyaltyCertificateBalanceEditType.ALL;
            default:
                throw new Error(`"${ value }" не является валидными значением для изменения баланса и срока. (нет, гдепродан, везде)`);
        }
    }

    private _getOnline (yesOrNoValue: string, titleValue: string, priceValue: string, descriptionValue: string, imageValue: string): GroupLoyaltyCertificateOnline {
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

    private _getYesOrNoBool (value: string): boolean {
        switch (value.trim().toLowerCase()) {
            case 'да':
                return true;
            case 'нет':
                return false;
            default:
                throw new Error(`"${ value }" не валидное значение "да" или "нет`);
        }
    }

    private _getTimeUnit (value: string): GroupLoyaltyCertificateTimeUnit {
        if (value.trim().toLowerCase() === 'неогр') {
            return {
                amount: 0,
                type  : GroupLoyaltyCertificateTimeUnitType.DAY,
            };
        }

        const [ _, amount, type ] = value.match(/(\d+)(.+)/) ?? [];
        const amountNumber        = Number(amount);
        if (amountNumber && type) {
            switch (type) {
                case 'д':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyCertificateTimeUnitType.DAY,
                    };
                case 'н':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyCertificateTimeUnitType.WEEK,
                    };
                case 'м':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyCertificateTimeUnitType.MONTH,
                    };
                case 'г':
                    return {
                        amount: amountNumber,
                        type  : GroupLoyaltyCertificateTimeUnitType.YEAR,
                    };
                default:
                    throw new Error(`"${ value }" не валидное значение времени`);
            }
        }

        throw new Error(`"${ value }" не валидное значение времени`);
    }
}