import {
    CompareRowValidationMethod,
} from '@/entity/compare/CompareRow/CompareRow.ts';
import { Nullable } from '@/types/Nullable.ts';
import {
    CompareTimeRangeValueType,
} from '@/entity/compare/CompareValue/CompareTimeRangeValue/CompareTimeRangeValue.ts';


export namespace CompareValidators {
    export const dates: CompareRowValidationMethod<Nullable<Array<string>>, Nullable<Array<string>>> = function (targetValue, clientValue) {
        if (targetValue && clientValue && (targetValue.length === clientValue.length)) {
            for (let i = 0; i < targetValue.length; i++) {
                if (targetValue[i] !== clientValue[i]) {
                    return false;
                }
            }

            return true;
        } else {
            return false;
        }
    };

    export const arrayWithString: (separator: string) => CompareRowValidationMethod<Nullable<Array<any>>, Nullable<string>> = function (separator: string) {
        return function (array, string) {
            if (array && string !== undefined) {
                return array.join(separator) === string;
            }

            return array === string;
        };
    };

    export const timeRangeWithNumber: CompareRowValidationMethod<Nullable<CompareTimeRangeValueType>, Nullable<number>> = function (targetValue, clientValue) {
        if (targetValue && clientValue !== undefined) {
            return targetValue[0] * 60 * 60 + targetValue[1] * 60 === clientValue;
        }

        return targetValue === clientValue;
    };
}