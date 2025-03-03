import {
    ActionComponent,
    ActionComponentProps,
} from '@/entity/actionComponent/ActionComponent.ts';
import {
    ServiceOnlineTitleUpdateItem,
} from '@/widget/settings/service/SettingsServiceOnlineTitleUpdateForm/SettingsServiceOnlineTitleUpdateForm.ts';
import { ProcessStatus } from '@/entity/processStatus/ProcessStatus.ts';
import {
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { Component } from '@/shared/component/Component.ts';
import { delay } from '@/helper/lib/delay/delay.ts';


export type SettingsServiceOnlineTitleUpdateActionProps =
    ActionComponentProps
    & {
        clientId: string;
        bearer: string;
        updateData: ServiceOnlineTitleUpdateItem;
    };

export class SettingsServiceOnlineTitleUpdateAction extends ActionComponent<void, void> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _updateData: ServiceOnlineTitleUpdateItem;
    private readonly _process: ProcessStatus;

    constructor (props: SettingsServiceOnlineTitleUpdateActionProps) {
        const { clientId, bearer, updateData, ...other } = props;
        super(other);

        this._clientId   = clientId;
        this._bearer     = bearer;
        this._updateData = updateData;

        const row = new Row({
            alignItemsCenter: true,
            cols            : [
                this._process = new ProcessStatus({ initialStatus: ProcessStatusType.NONE }),
                new Component('span', {
                    textContent: `[${ this._updateData.id }] ${ this._updateData.checkTitleAfter } / ${ this._updateData.onlineTitleAfter }`,
                }),
            ],
        });

        row.insert(this.element, 'afterbegin');
    }

    public getAction (): () => Promise<void> {
        return async () => {
            this._process.setStatus(ProcessStatusType.PROCESS);
            await delay(1000);
            this._process.setStatus(ProcessStatusType.SUCCESS);
            console.log('Update service', this._clientId, this._bearer, this._updateData);
        };
    }
}