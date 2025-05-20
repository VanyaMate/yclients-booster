import {
    SettingsConverter,
} from '@/entity/compare/converters/settings/SettingsConverter.ts';
import { UnitMapper } from '@/mapper/UnitMapper.ts';
import { VatMapper } from '@/mapper/VatMapper.ts';
import { TaxMapper } from '@/mapper/TaxMapper.ts';
import {
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';
import {
    FinancesExpenseType,
} from '@/action/finances/expenses/types/FinancesExpenses.types.ts';


export namespace Converter {
    export const Settings = SettingsConverter;

    export const yesOrNo = function (value?: boolean) {
        return value ? 'Да' : 'Нет';
    };

    export const taxVariant = function (type: number | undefined | null = -1): string {
        return TaxMapper[type as keyof typeof TaxMapper] ?? 'Неизвестный tax variant';
    };

    export const vatId = function (type: number | undefined | null = -1): string {
        return VatMapper[type as keyof typeof VatMapper] ?? 'Неизвестный vat id';
    };

    export const unitId = function (id: string | undefined | null = '216779'): string {
        return UnitMapper[id as keyof typeof UnitMapper] ?? 'Неизвестный unit';
    };

    export const period = function (type?: number | null): string {
        switch (type) {
            case 0:
                return 'Месяц';
            case 1:
                return 'День';
            default:
                return 'Неизвестно';
        }
    };

    export namespace Finances {
        export namespace Supplier {
            export const type = function (type: number) {
                switch (type) {
                    case FinancesSupplierType.FIZ:
                        return 'Физ.лицо';
                    case FinancesSupplierType.IP:
                        return 'ИП';
                    case FinancesSupplierType.YR:
                        return 'Юр.лицо';
                    default:
                        return 'Неизвестный тип';
                }
            };
        }

        export namespace Expenses {
            export const type = function (type: number) {
                switch (type) {
                    case FinancesExpenseType.PROFIT:
                        return 'Доходы';
                    case FinancesExpenseType.EXPENSES_SEBES:
                        return 'Расходы на себестоимость';
                    case FinancesExpenseType.EXPENSES_COMM:
                        return 'Коммерческие расходы';
                    case FinancesExpenseType.EXPENSES_STUFF:
                        return 'Расходы на персонал';
                    case FinancesExpenseType.EXPENSES_ADMIN:
                        return 'Административно-хозяйственные расходы';
                    case FinancesExpenseType.TAX:
                        return 'Налоги и сборы';
                    case FinancesExpenseType.EXPENSES_OTHER:
                        return 'Прочие расходы';
                    default:
                        return 'Неизвестный тип';
                }
            };

            export const labelToType = function (label: string): FinancesExpenseType {
                switch (label) {
                    case 'Доходы':
                        return FinancesExpenseType.PROFIT;
                    case 'Расходы на себестоимость':
                        return FinancesExpenseType.EXPENSES_SEBES;
                    case 'Коммерческие расходы':
                        return FinancesExpenseType.EXPENSES_COMM;
                    case 'Расходы на персонал':
                        return FinancesExpenseType.EXPENSES_STUFF;
                    case 'Административно-хозяйственные расходы':
                        return FinancesExpenseType.EXPENSES_ADMIN;
                    case 'Налоги и сборы':
                        return FinancesExpenseType.TAX;
                    case 'Прочие расходы':
                        return FinancesExpenseType.EXPENSES_OTHER;
                    default:
                        throw new Error('Неизвестный тип');
                }
            };
        }
    }
}