import {
    ActionComponent,
    ActionComponentProps,
} from '@/entity/actionComponent/ActionComponent.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { ProcessStatus } from '@/entity/processStatus/ProcessStatus.ts';
import {
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { Component } from '@/shared/component/Component.ts';
import {
    removeSettingsServiceRequestAction,
} from '@/action/settings/service_categories/request-action/removeSettingsService/removeSettingsService.request-action.ts';


export type SettingsServiceRemoveActionProps =
    ActionComponentProps
    & {
        bearer: string;
        clientId: string;
        serviceId: string;
        serviceTitle: string;
        logger: ILogger;
    };

export class SettingsServiceRemoveAction extends ActionComponent<void, void> {
    private readonly _bearer: string;
    private readonly _clientId: string;
    private readonly _serviceId: string;
    private readonly _logger: ILogger;
    private readonly _process: ProcessStatus;
    private readonly _content: Row;

    constructor (props: SettingsServiceRemoveActionProps) {
        const {
                  bearer,
                  clientId,
                  serviceTitle,
                  serviceId,
                  logger,
                  ...other
              } = props;
        super(other);

        this._bearer    = bearer;
        this._clientId  = clientId;
        this._logger    = logger;
        this._serviceId = serviceId;
        this._logger    = logger;

        this._process = new ProcessStatus({ initialStatus: ProcessStatusType.NONE });
        this._content = new Row({
            alignItemsCenter: true,
            cols            : [
                this._process,
                new Component('span', { textContent: `[${ serviceId }] ${ serviceTitle }` }),
            ],
        });

        this._content.insert(this.element, 'afterbegin');
    }

    getAction (): () => Promise<void> {
        this._process.setStatus(ProcessStatusType.IDLE);
        return async () => {
            this._process.setStatus(ProcessStatusType.PROCESS);
            await removeSettingsServiceRequestAction(this._bearer, this._clientId, this._serviceId, this._logger)
                .then(() => this._process.setStatus(ProcessStatusType.SUCCESS))
                .catch(() => this._process.setStatus(ProcessStatusType.ERROR));
        };
    }
}