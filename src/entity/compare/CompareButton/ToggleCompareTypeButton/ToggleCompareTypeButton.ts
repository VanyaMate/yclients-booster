import { Button, ButtonProps } from '@/shared/buttons/Button/Button.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import {
    ICompareHeader,
} from '@/entity/compare/CompareHeader/CompareHeader.interface.ts';
import {
    CompareHeaderResponseOnSignalDetails,
    CompareHeaderResponseOnSignalEventType, CompareHeaderSignalEvent,
} from '@/entity/compare/CompareHeaderResponseOnSignalEvent.ts';


export type ToggleCompareTypeButtonProps =
    ButtonProps
    & {
        container: HTMLElement;
        headerType: string;
        compareType: CompareType;
    };

export class ToggleCompareTypeButton extends Button {
    constructor (props: ToggleCompareTypeButtonProps) {
        const { container, headerType, compareType, ...other } = props;
        super(other);

        this.element.addEventListener('click', ToggleCompareTypeButton.handler.bind(null, container, headerType, compareType));
    }

    static handler (container: HTMLElement, headerType: string, compareType: CompareType) {
        const headers: Record<string, Array<ICompareHeader>> = {};
        // 1. Повесить обработчик на контейнер
        const handler                                        = function (event: CustomEvent<CompareHeaderResponseOnSignalDetails>) {
            if (headers[event.detail.type]) {
                headers[event.detail.type].push(event.detail.header);
            } else {
                headers[event.detail.type] = [ event.detail.header ];
            }
        };

        container.addEventListener(CompareHeaderResponseOnSignalEventType, handler as EventListener);
        // 2. Подать сигнал
        document.dispatchEvent(CompareHeaderSignalEvent);
        // 3. Собрать все headers
        // 4. Вызвать нужные compareType на нужных headers
        headers[headerType]?.forEach((header) => header.setCompareType(compareType));
        // 5. Удлаить обработчик с контейнера
        container.removeEventListener(CompareHeaderResponseOnSignalEventType, handler as EventListener);
    }
}