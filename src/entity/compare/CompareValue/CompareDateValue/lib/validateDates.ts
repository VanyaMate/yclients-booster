import { Nullable } from '@/types/Nullable.ts';
import {
    CompareRowValidationMethod,
} from '@/entity/compare/CompareRow/CompareRow.ts';


export const validateDates: CompareRowValidationMethod<Nullable<Array<string>>, Nullable<Array<string>>> = function (targetValue, clientValue) {
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