import {
    SettingsConverter,
} from '@/entity/compare/converters/settings/SettingsConverter.ts';
import { UnitMapper } from '@/mapper/UnitMapper.ts';
import { VatMapper } from '@/mapper/VatMapper.ts';
import { TaxMapper } from '@/mapper/TaxMapper.ts';
import {
    FinancesSupplierType,
} from '@/action/finances/suppliers/types/FinancesSuplier.types.ts';


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
    }
}