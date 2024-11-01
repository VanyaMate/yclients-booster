import './styles/palette.css';
import './styles/offset.css';
import './styles/light-theme.css';
import './styles/transition.css';

import { goodsPageHandler, isGoodsPage } from './pages/storage/goods';
import {
    isNetServiceMigrationPage,
    netServiceMigrationPageHandler,
} from '@/pages/net/service/migration';
import {
    isSalaryParamsListPage,
    salaryParamsListHandler,
} from '@/pages/salary_params/list';


const pathParts = location.pathname.split('/');

if (isGoodsPage(pathParts)) {
    goodsPageHandler();
} else if (isNetServiceMigrationPage(pathParts)) {
    netServiceMigrationPageHandler();
} else if (isSalaryParamsListPage(pathParts)) {
    salaryParamsListHandler();
}