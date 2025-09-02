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
import {
    groupLoyaltyAbonement,
    isGroupLoyaltyAbonement,
} from '@/pages/net/group_loyalty_abonement/groupLoyaltyAbonement.ts';
import {
    groupLoyaltyCertificate,
    isGroupLoyaltyCertificate,
} from '@/pages/net/group_loyalty_certificate/groupLoyaltyCertificate.ts';
import {
    isSettingsFilialStuffPage,
    settingsFilialStuffPageHandler,
} from '@/pages/settings/filial_stuff';
import {
    financesSuppliersPageHandler,
    isFinancesSuppliersPage,
} from '@/pages/finances/suppliers';
import {
    financesExpensesPageHandler,
    isFinancesExpenses,
} from '@/pages/finances/expenses';
import {
    isTehnologicalCardsPage,
    tehnologicalCardsPageHandler,
} from '@/pages/tehnological_cards';


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
} else if (isGroupLoyaltyAbonement(pathParts)) {
    groupLoyaltyAbonement();
} else if (isGroupLoyaltyCertificate(pathParts)) {
    groupLoyaltyCertificate();
} else if (isSettingsFilialStuffPage(pathParts)) {
    settingsFilialStuffPageHandler(pathParts);
} else if (isFinancesSuppliersPage(pathParts)) {
    financesSuppliersPageHandler(pathParts);
} else if (isFinancesExpenses(pathParts)) {
    financesExpensesPageHandler(pathParts);
} else if (isTehnologicalCardsPage(pathParts)) {
    tehnologicalCardsPageHandler(pathParts);
}

commonPageHandler();