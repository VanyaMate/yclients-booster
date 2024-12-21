import { isUndefined } from '@vanyamate/types-kit';


export namespace ServiceConverter {
    export const type = function (isMulti?: boolean) {
        switch (isMulti) {
            case true:
                return 'Групповой';
            default:
                return 'Индивидуальный';
        }
    };

    export const duration = function (minutes?: number) {
        return !isUndefined(minutes)
               ? `${ Math.floor(minutes / 60 / 60).toString() }ч ${ Math.floor(minutes / 60 % 60).toString() }м`
               : undefined;
    };
}