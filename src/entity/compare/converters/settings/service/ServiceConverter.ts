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
}