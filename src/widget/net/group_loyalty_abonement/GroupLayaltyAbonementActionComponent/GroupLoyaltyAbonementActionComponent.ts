import {
    ActionComponent,
    ActionComponentProps,
} from '@/entity/actionComponent/ActionComponent.ts';
import {
    GroupLoyaltyAbonementAddItem,
} from '@/widget/net/group_loyalty_abonement/GroupLoyaltyAbonementMassAddForm/types/mass-add-form.types.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { ProcessStatus } from '@/entity/processStatus/ProcessStatus.ts';
import {
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Component } from '@/shared/component/Component.ts';


export type GroupLoyaltyAbonementActionComponentProps =
    ActionComponentProps
    & {
        clientId: string;
        data: GroupLoyaltyAbonementAddItem;
    };

export class GroupLoyaltyAbonementActionComponent extends ActionComponent {
    constructor (props: GroupLoyaltyAbonementActionComponentProps) {
        const { clientId, data, ...other } = props;
        super(other);

        new Row({
            cols: [
                new ProcessStatus({ initialStatus: ProcessStatusType.NONE }),
                new ProcessStatus({ initialStatus: ProcessStatusType.IDLE }),
                new ProcessStatus({ initialStatus: ProcessStatusType.PROCESS }),
                new ProcessStatus({ initialStatus: ProcessStatusType.SUCCESS }),
                new ProcessStatus({ initialStatus: ProcessStatusType.ERROR }),
                new Component<HTMLDivElement>('div', { textContent: data.title }),
            ],
        })
            .insert(this.element, 'afterbegin');
    }

    getAction<ResponseType, DataType extends unknown> (): (data?: DataType) => Promise<ResponseType> {
        // create abonement
        throw new Error('Method not implemented.');
    }
}