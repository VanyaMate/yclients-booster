import { startHandler } from '@/shared/lib/startHandler.ts';
import {
    RemoveAllCardsModalButton,
} from '@/widget/tehnological_cards/RemoveAllCardsModalButton/RemoveAllCardsModalButton.ts';
import { Row } from '@/shared/box/Row/Row.ts';


export const isTehnologicalCardsPage = function (urlParts: Array<string>): boolean {
    return urlParts[1] === 'technological_cards' && !!urlParts[2].match(/\d/);
};

export const tehnologicalCardsPageHandler = function (urlParts: Array<string>) {
    const clientId: string = urlParts[2];

    startHandler(() => {
        const wrapper = document.querySelector('.wrapper-content');
        if (wrapper) {
            const content = new Row({
                cols: [
                    new RemoveAllCardsModalButton({ clientId }),
                ],
            });
            content.insert(wrapper, 'beforebegin');
        }
    });
};