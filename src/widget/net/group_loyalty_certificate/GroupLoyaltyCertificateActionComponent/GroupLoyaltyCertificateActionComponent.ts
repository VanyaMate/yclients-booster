import {
    ActionComponent,
    ActionComponentProps,
} from '@/entity/actionComponent/ActionComponent.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    GroupLoyaltyCertificateMassAddItem,
} from '@/widget/net/group_loyalty_certificate/GroupLoyaltyCertificateMassAddForm/types/mass-add-certificate.types.ts';
import {
    createGroupLoyaltyCertificate,
} from '@/action/net/group-loyalty-certificate/request-action/createGroupLoyaltyCertificate.ts';
import {
    IProcessStatus, ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Row } from '@/shared/box/Row/Row.ts';
import { ProcessStatus } from '@/entity/processStatus/ProcessStatus.ts';
import { Component } from '@/shared/component/Component.ts';
import {
    convertFromCertificateInputToCreateData,
} from '@/action/net/group-loyalty-certificate/converter/convertFromCertificateInputToCreateData.ts';


export type GroupLoyaltyCertificateActionComponentProps =
    ActionComponentProps
    & {
        clientId: string;
        logger?: ILogger;
        data: GroupLoyaltyCertificateMassAddItem;
    };

export class GroupLoyaltyCertificateActionComponent extends ActionComponent<any, any> {
    private readonly _processStatus: IProcessStatus;
    private readonly _clientId: string;
    private readonly _data: GroupLoyaltyCertificateMassAddItem;
    private readonly _logger?: ILogger;

    constructor (props: GroupLoyaltyCertificateActionComponentProps) {
        const { clientId, logger, data, ...other } = props;
        super(other);

        this._clientId = clientId;
        this._data     = data;
        this._logger   = logger;

        new Row({
            cols            : [
                this._processStatus = new ProcessStatus({ initialStatus: ProcessStatusType.NONE }),
                new Component<HTMLDivElement>('div', { textContent: data.title }),
            ],
            alignItemsCenter: true,
        })
            .insert(this.element, 'afterbegin');
    }

    getAction (): () => Promise<any> {
        this._processStatus.setStatus(ProcessStatusType.IDLE);
        return async () => {
            this._processStatus.setStatus(ProcessStatusType.PROCESS);
            const data = await convertFromCertificateInputToCreateData(this._data, this._logger);
            return createGroupLoyaltyCertificate(this._clientId, data, this._logger)
                .then(() => this._processStatus.setStatus(ProcessStatusType.SUCCESS))
                .catch((error) => {
                    this._processStatus.setStatus(ProcessStatusType.ERROR);
                    throw error;
                });
        };
    }
}