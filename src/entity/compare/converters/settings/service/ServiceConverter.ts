import {
    ComparePriceSelectType, ComparePriceWithSelectValueType,
} from '@/entity/compare/CompareValue/ComparePriceWithSelectValue/ComparePriceWithSelectValue.ts';
import {
    CompareTimeRangeValueType,
} from '@/entity/compare/CompareValue/CompareTimeRangeValue/CompareTimeRangeValue.ts';


export namespace ServiceConverter {
    export const multiType = function (isMulti?: boolean) {
        switch (isMulti) {
            case true:
                return 'Групповой';
            default:
                return 'Индивидуальный';
        }
    };

    export const yesOrNo = function (value?: boolean) {
        return value ? 'Да' : 'Нет';
    };

    export const priceLabel = function (amount?: number, percents?: number) {
        if (amount !== undefined && percents !== undefined) {
            return amount ? `${ amount } ${ ComparePriceSelectType.RUBLES }`
                          : `${ percents } ${ ComparePriceSelectType.PERCENTS }`;
        }

        return undefined;
    };

    export const priceValue = function (amount: number, percents: number): ComparePriceWithSelectValueType {
        if (amount === 0) {
            return [ percents.toString(), ComparePriceSelectType.PERCENTS ];
        } else {
            return [ amount.toString(), ComparePriceSelectType.RUBLES ];
        }
    };

    export const timeRangeLabel = function (seconds?: number) {
        if (seconds !== undefined) {
            const [ hours, minutes ] = timeRangeValue(seconds);
            return `${ hours }ч ${ minutes }м`;
        }

        return undefined;
    };

    export const timeRangeValue = function (seconds: number): CompareTimeRangeValueType {
        return [
            Math.floor(seconds / 60 / 60),
            Math.floor(seconds / 60 % 60),
        ];
    };

    export const datesBorderEnabledValue = function (dates?: Array<string>, start?: number, end?: number) {
        if (dates && start !== undefined && end !== undefined) {
            return (!!dates.length || start !== 0 || end !== 86400);
        }

        return undefined;
    };

    export const datesBorderEnabledLabel = function (dates?: Array<string>, start?: number, end?: number) {
        if (dates && start !== undefined && end !== undefined) {
            return yesOrNo(!!dates.length || start !== 0 || end !== 86400);
        }

        return undefined;
    };

    export const taxVariant = function (type?: number | null): string {
        switch (type) {
            case -1:
                return 'По умолчанию';
            case 0:
                return 'Общая ОСН';
            case 1:
                return 'Упрощенная УСН (Доход)';
            case 2:
                return 'Упрощенная УСН (Доход минус Расход)';
            case 3:
                return 'Единый налог на вмененный доход ЕНВД';
            case 4:
                return 'Единый сельскохозяйственный налог ЕСН';
            case 5:
                return 'Патентная система налогообложения';
            default:
                return 'По умолчанию';
        }
    };

    export const vatId = function (type?: number | null): string {
        switch (type) {
            case -1:
                return 'По умолчанию';
            case 1:
                return '0% НДС';
            case 2:
                return '10% НДС';
            case 3:
                return '20% НДС';
            case 4:
                return 'Не облагается';
            default:
                return 'По умолчанию';
        }
    };
}