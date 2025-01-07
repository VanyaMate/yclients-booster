import {
    ICompareValue,
} from '@/entity/compare/CompareValue/CompareValue.interface.ts';
import {
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Nullable } from '@/types/Nullable';
import { Row } from '@/shared/box/Row/Row.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import css from './SalaryCriteriaRuleCompareValue.module.css';
import {
    SalaryCriteriaConverter,
} from '@/widget/salary_criteria/converter/SalaryCriteriaConverter.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import NetCost = SalaryCriteriaConverter.NetCost;
import TargetType = SalaryCriteriaConverter.TargetType;
import IndividualType = SalaryCriteriaConverter.IndividualType;
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import { isUndefined } from '@vanyamate/types-kit';


export type SalaryCriteriaRuleCompareValueProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        value?: SalaryCriteriaRuleData;
        editable: boolean;
    };

export class SalaryCriteriaRuleCompareValue extends Component<HTMLDivElement> implements ICompareValue<SalaryCriteriaRuleData> {
    private readonly _value: SalaryCriteriaRuleData | null;

    constructor (props: SalaryCriteriaRuleCompareValueProps) {
        const {
                  value,
                  editable = true,
                  ...other
              } = props;
        super('div', other);
        this._value = value ?? null;
        this.element.classList.add(css.container);
        this._render(editable);
    }

    getValue (): Nullable<SalaryCriteriaRuleData> {
        return this._value;
    }

    private _render (editable: boolean) {
        new Col({
            rows: [
                this._nonEditableRow('Id', this._value?.id),
                this._netCostRow(editable),
                this._individualTypeRow(editable),
                this._targetTypeRow(editable),
                this._amountRow(editable),
                this._discountRow(editable),
            ],
        })
            .insert(this.element, 'afterbegin');
    }

    private _netCostRow (editable: boolean) {
        const netCost = this._value?.useNetCost.toString();

        if (editable && !isUndefined(netCost)) {
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLSpanElement>('span', { textContent: `Что:` }),
                    new CompareSelectValue({
                        defaultValue    : '0',
                        defaultLabel    : '',
                        showValue       : false,
                        showDefaultLabel: false,
                        list            : [
                            {
                                value   : NetCost.FLOW,
                                label   : SalaryCriteriaConverter.useNetCost(NetCost.FLOW),
                                selected: netCost === NetCost.FLOW,
                            },
                            {
                                value   : NetCost.PROFIT,
                                label   : SalaryCriteriaConverter.useNetCost(NetCost.PROFIT),
                                selected: netCost === NetCost.PROFIT,
                            },
                            {
                                value   : NetCost.AMOUNT,
                                label   : SalaryCriteriaConverter.useNetCost(NetCost.AMOUNT),
                                selected: netCost === NetCost.AMOUNT,
                            },
                        ],
                        onChange        : (select) => {
                            this._value!.useNetCost = select.value;
                        },
                    }),
                ],
            });
        }

        return this._nonEditableRow('Что', netCost, SalaryCriteriaConverter.useNetCost(netCost ?? '0'));
    }

    private _targetTypeRow (editable: boolean) {
        const targetType = this._value?.targetType.toString();

        if (editable && !isUndefined(targetType)) {
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLSpanElement>('span', { textContent: `За что:` }),
                    new CompareSelectValue({
                        defaultValue    : '0',
                        defaultLabel    : '',
                        showValue       : false,
                        showDefaultLabel: false,
                        list            : [
                            {
                                value   : TargetType.SERVICES,
                                label   : SalaryCriteriaConverter.targetType(TargetType.SERVICES),
                                selected: targetType === TargetType.SERVICES,
                            },
                            {
                                value   : TargetType.GOODS,
                                label   : SalaryCriteriaConverter.targetType(TargetType.GOODS),
                                selected: targetType === TargetType.GOODS,
                            },
                            {
                                value   : TargetType.SERVICES_AND_GOODS,
                                label   : SalaryCriteriaConverter.targetType(TargetType.SERVICES_AND_GOODS),
                                selected: targetType === TargetType.SERVICES_AND_GOODS,
                            },
                        ],
                        onChange        : (select) => {
                            this._value!.targetType = select.value;
                        },
                    }),
                ],
            });
        }

        return this._nonEditableRow('За что', targetType, SalaryCriteriaConverter.targetType(targetType ?? '0'));
    }

    private _individualTypeRow (editable: boolean) {
        const individualType = this._value?.individualType.toString();

        if (editable && !isUndefined(individualType)) {
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLSpanElement>('span', { textContent: `Для кого:` }),
                    new CompareSelectValue({
                        defaultValue    : '0',
                        defaultLabel    : '',
                        showValue       : false,
                        showDefaultLabel: false,
                        list            : [
                            {
                                value   : IndividualType.BRANCH,
                                label   : SalaryCriteriaConverter.individualType(IndividualType.BRANCH),
                                selected: individualType === IndividualType.BRANCH,
                            },
                            {
                                value   : IndividualType.EMPLOYEE,
                                label   : SalaryCriteriaConverter.individualType(IndividualType.EMPLOYEE),
                                selected: individualType === IndividualType.EMPLOYEE,
                            },
                        ],
                        onChange        : (select) => {
                            this._value!.individualType = select.value;
                        },
                    }),
                ],
            });
        }

        return this._nonEditableRow('Для кого', individualType, SalaryCriteriaConverter.individualType(individualType ?? '0'));
    }

    private _amountRow (editable: boolean) {
        const amount = this._value?.amount.toString();

        if (editable && !isUndefined(amount)) {
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLSpanElement>('span', { textContent: `Превышает:` }),
                    new CompareTextInputValue({
                        value  : amount,
                        type   : 'text',
                        onInput: (value) => this._value!.amount = value,
                    }),
                ],
            });
        }

        return this._nonEditableRow('Превышает', amount);
    }

    private _discountRow (editable: boolean) {
        const discount = this._value?.useDiscount;

        if (editable && !isUndefined(discount)) {
            return new Row({
                className: css.row,
                cols     : [
                    new Component<HTMLSpanElement>('span', { textContent: `С учетом скидки:` }),
                    new CompareSelectValue({
                        defaultValue    : '0',
                        defaultLabel    : '',
                        showValue       : false,
                        showDefaultLabel: false,
                        list            : [
                            {
                                value   : '0',
                                label   : Converter.yesOrNo(false),
                                selected: discount === '0',
                            },
                            {
                                value   : '1',
                                label   : Converter.yesOrNo(true),
                                selected: discount === '1',
                            },
                        ],
                        onChange        : (select) => {
                            this._value!.useDiscount = select.value;
                        },
                    }),
                ],
            });
        }

        return this._nonEditableRow('С учетом скидки', discount, Converter.yesOrNo(!!discount));
    }

    private _nonEditableRow (key: string, value: string | number | undefined, label?: string) {
        return new Row({
            className: css.row,
            cols     : [
                new Component<HTMLSpanElement>('span', { textContent: `${ key }:` }),
                new CompareTextValue({ value, label }),
            ],
        });
    }
}