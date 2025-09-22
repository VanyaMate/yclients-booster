import { Row } from "@/shared/box/Row/Row";
import { startHandler } from "@/shared/lib/startHandler";
import { CreateClientsFormModalButton } from "@/widget/client/CreateClientsFormModalButton/CreateClientsFormModalButton";

export const isClientsBasePage = function (pathnames: Array<string>): boolean {
    if (pathnames[1] === 'clients' && pathnames[2].match(/\d/) && pathnames[3] === 'base') {
        return true;
    }
    return false;
}

export const clientsBasePageHandler = function (pathnames: Array<string>) {
    const clientId: string = pathnames[2];
    
    startHandler(() => {
        const container = document.querySelector('#clients-base-app');
        if (container) {
            const row = new Row({ cols: [
                new CreateClientsFormModalButton({ clientId })
            ]});

            row.insert(container, 'afterbegin');
            row.element.style.paddingBottom = '40px';
        }
    });
}