export namespace SalaryCriteriaConverter {
    export enum NetCost {
        FLOW   = '0',
        PROFIT = '1',
        AMOUNT = '2'
    }

    export enum TargetType {
        SERVICES           = '0',
        GOODS              = '1',
        SERVICES_AND_GOODS = '2'
    }

    export enum IndividualType {
        BRANCH   = '0',
        EMPLOYEE = '1'
    }

    export const useNetCost = function (value: string | number | NetCost): string {
        switch (value.toString()) {
            case NetCost.FLOW:
                return 'Оборот';
            case NetCost.PROFIT:
                return 'Прибыль';
            case NetCost.AMOUNT:
                return 'Количество';
            default:
                throw new Error(`useNetCost "${ value }" не является правильным типом`);
        }
    };

    export const targetType = function (value: string | number | TargetType): string {
        switch (value.toString()) {
            case TargetType.SERVICES:
                return 'Оказание услуг';
            case TargetType.GOODS:
                return 'Продажа товаров';
            case TargetType.SERVICES_AND_GOODS:
                return 'Оказание услуг и продажа товаров';
            default:
                throw new Error(`targetType "${ value }" не является правильным типом`);
        }
    };

    export const individualType = function (value: string | number | IndividualType) {
        switch (value.toString()) {
            case IndividualType.BRANCH:
                return 'Филиала';
            case IndividualType.EMPLOYEE:
                return 'Сотрудника';
            default:
                throw new Error(`individualType "${ value }" не является правильным типом`);
        }
    };
}