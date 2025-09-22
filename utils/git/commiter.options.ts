import { resolve } from 'path';
import { CommiterOptions } from '@vanyamate/commiter';


/// @ts-ignore
const __dirname = import.meta.dirname;
const gitFolder = resolve(__dirname, '..', '..');

export default {
    types                  : [ '❤️ Update', '🙏 Fix', '🔥 New feature' ],
    entities               : [
        'UI Kit',
        'Общее',
        'Товары',
        'Критерии товаров',
        'Ресурсы',
        'Экземпляры ресурсов',
        'Лейблы клиентов',
        'Категории услуг',
        'Услуги',
        'Критерии ЗП',
        'Сеть (Сервисы-Миграции)',
        'Параметры ЗП',
        'Типы абонементов',
        'Типы сертификатов',
        'Сотрудники',
        'Контрагенты',
        'Статьи платежей',
        'Технологические карты',
        'Клиенты'
    ],
    postfixes              : [ 'wip', 'temp' ],
    postfixesSeparator     : ', ',
    pattern                : `{{type}} : {{entities}} - {{message}} {{[ postfixes ]}}`,
    gitFolder              : gitFolder,
    gitRemoteRepositoryName: 'origin',
    gitPushDefault         : true,
} as CommiterOptions;