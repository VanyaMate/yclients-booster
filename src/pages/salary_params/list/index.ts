import { startHandler } from '@/shared/lib/startHandler.ts';
import {
    CopySalaryParamsListForm,
} from '@/widget/salary_params/list/CopySalaryParamsListForm/CopySalaryParamsListForm.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export const isSalaryParamsListPage = function (pathnameParts: Array<string>): boolean {
    return pathnameParts[1] === 'salary_params' && pathnameParts[2] === 'list' && !!pathnameParts[3].match(/\d+/);
};

export const salaryParamsListHandler = function () {
    startHandler(() => {
        const container = document.querySelector('.page-tools');

        if (container) {
            const modal = new Modal({
                content: new CopySalaryParamsListForm({}),
                label  : 'Копировать в другой филиал',
            });

            new Button({
                innerHTML: 'Копировать в другой филиал',
                styleType: ButtonStyleType.PRIMARY,
                onclick  : () => modal.show(),
            }).insert(container, 'afterbegin');
        }
    });
};