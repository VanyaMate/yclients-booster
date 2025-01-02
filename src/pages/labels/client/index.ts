import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import './index.css';
import {
    CopyLabelsClientButton,
} from '@/widget/labels/client/CopyLabelsClientButton/CopyLabelsClientButton.ts';


export const isLabelsClientPage = function (pathname: Array<string>) {
    return pathname[1] === 'labels' && pathname[2] === 'client' && pathname[3].match(/\d+/);
};

export const labelsClientPageHandler = function () {
    startHandler(() => {
        const container = document.querySelector(`#page-wrapper .wrapper-content .row`);
        const clientId  = location.pathname.split('/')[3];
        console.log(container, clientId);

        if (container) {
            new Col({
                rows: [
                    new CopyLabelsClientButton({ clientId }),
                ],
            }).insert(container, 'beforebegin');
        }
    });
};