import {
    SettingsConverter,
} from '@/entity/compare/converters/settings/SettingsConverter.ts';
import { UnitMapper } from '@/mapper/UnitMapper.ts';


export namespace Converter {
    export const Settings = SettingsConverter;

    export const yesOrNo = function (value?: boolean) {
        return value ? 'Да' : 'Нет';
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

    export const unitId = function (id: keyof typeof UnitMapper = '216779'): string {
        return UnitMapper[id];
    };
}