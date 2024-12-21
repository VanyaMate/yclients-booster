import './styles/styles.css';

import { goodsPageHandler, isGoodsPage } from './pages/storage/goods';
import {
    isNetServiceMigrationPage,
    netServiceMigrationPageHandler,
} from '@/pages/net/service/migration';
import {
    isSalaryParamsListPage,
    salaryParamsListHandler,
} from '@/pages/salary_params/list';
import {
    isSalaryCriteriaPage,
    salaryCriteriaPageHandler,
} from '@/pages/salary_criteria';
import { commonPageHandler } from '@/pages/_common';
import {
    isLabelsClientPage, labelsClientPageHandler,
} from '@/pages/labels/client';
import {
    isOnlineBookingForm,
    onlineBookingFormPageHandler,
} from '@/pages/online_booking/_clientId/forms';
import {
    isSettingsServicePage,
    settingsServicePageHandler,
} from '@/pages/settings/service';
import { isResourcesPage, resourcesPageHandler } from '@/pages/resources';


// document.body.classList.add('booster-dark');

const pathParts = location.pathname.split('/');

if (isGoodsPage(pathParts)) {
    goodsPageHandler();
} else if (isNetServiceMigrationPage(pathParts)) {
    netServiceMigrationPageHandler();
} else if (isSalaryParamsListPage(pathParts)) {
    salaryParamsListHandler();
} else if (isSalaryCriteriaPage(pathParts)) {
    salaryCriteriaPageHandler();
} else if (isLabelsClientPage(pathParts)) {
    labelsClientPageHandler();
} else if (isOnlineBookingForm(pathParts)) {
    onlineBookingFormPageHandler();
} else if (isSettingsServicePage(pathParts)) {
    settingsServicePageHandler(pathParts);
} else if (isResourcesPage(pathParts)) {
    resourcesPageHandler(pathParts);
}

commonPageHandler();