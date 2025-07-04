import {
    ActionComponent,
    ActionComponentProps,
} from '@/entity/actionComponent/ActionComponent.ts';
import { ProcessStatus } from '@/entity/processStatus/ProcessStatus.ts';
import {
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { Component } from '@/shared/component/Component.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    updateSettingsServiceByTargetRequestAction,
} from '@/action/settings/service_categories/request-action/updateSettingsServiceByTarget/updateSettingsServiceByTarget.request-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';


export type SettingsServiceDescriptionUpdateActionProps =
    ActionComponentProps
    & {
        clientId: string;
        bearer: string;
        serviceData: SettingsServiceData;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class SettingsServiceDescriptionUpdateAction extends ActionComponent<void, void> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _serviceData: SettingsServiceData;
    private readonly _process: ProcessStatus;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;

    constructor (props: SettingsServiceDescriptionUpdateActionProps) {
        const {
                  clientId,
                  bearer,
                  serviceData,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._clientId    = clientId;
        this._bearer      = bearer;
        this._serviceData = serviceData;
        this._logger      = logger;
        this._fetcher     = fetcher;

        const row = new Row({
            alignItemsCenter: true,
            cols            : [
                this._process = new ProcessStatus({ initialStatus: ProcessStatusType.NONE }),
                new Component('span', {
                    textContent: `[${ this._serviceData.id }] описание: ${ this._serviceData.comment }`,
                }),
            ],
        });

        row.insert(this.element, 'afterbegin');
    }

    public getAction (): () => Promise<void> {
        this._process.setStatus(ProcessStatusType.IDLE);
        return async () => {
            this._process.setStatus(ProcessStatusType.PROCESS);
            await updateSettingsServiceByTargetRequestAction(this._bearer, this._clientId, this._serviceData, this._serviceData, this._fetcher, this._logger)
                .then(() => {
                    this._process.setStatus(ProcessStatusType.SUCCESS);
                })
                .catch(() => {
                    this._process.setStatus(ProcessStatusType.ERROR);
                });
        };
    }
}