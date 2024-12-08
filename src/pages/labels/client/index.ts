import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import './index.css';


export const isLabelsClientPage = function (pathname: Array<string>) {
    return pathname[1] === 'labels' && pathname[2] === 'client' && pathname[3].match(/\d+/);
};

export const labelsClientPageHandler = function () {
    startHandler(() => {
        const container = document.querySelector(`#page-wrapper .wrapper-content .row`);
        const clientId  = location.pathname.split('/')[3];
        console.log(clientId);

        if (container) {
            new Col({
                rows: [],
            }).insert(container, 'beforebegin');
        }
    });
};