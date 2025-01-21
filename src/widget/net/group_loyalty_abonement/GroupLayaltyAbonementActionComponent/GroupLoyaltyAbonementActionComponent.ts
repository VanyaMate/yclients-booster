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
    IProcessStatus,
    ProcessStatusType,
} from '@/entity/processStatus/ProcessStatus.interface.ts';
import { Component } from '@/shared/component/Component.ts';
import {
    createGroupLoyaltyAbonement,
} from '@/action/net/group-loyalty-abonement/createGroupLoyaltyAbonement.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    convertFromInputToCreateData,
} from '@/action/net/group-loyalty-abonement/converter/convertFromInputToCreateData.ts';


export type GroupLoyaltyAbonementActionComponentProps =
    ActionComponentProps
    & {
        clientId: string;
        bearer: string;
        logger?: ILogger;
        fetcher?: IFetcher;
        data: GroupLoyaltyAbonementAddItem;
    };

export class GroupLoyaltyAbonementActionComponent extends ActionComponent<any, any> {
    private readonly _processStatus: IProcessStatus;
    private readonly _data: GroupLoyaltyAbonementAddItem;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;

    constructor (props: GroupLoyaltyAbonementActionComponentProps) {
        const { clientId, bearer, logger, fetcher, data, ...other } = props;
        super(other);

        this._clientId = clientId;
        this._bearer   = bearer;
        this._logger   = logger;
        this._fetcher  = fetcher;
        this._data     = data;

        new Row({
            cols            : [
                this._processStatus = new ProcessStatus({ initialStatus: ProcessStatusType.NONE }),
                new Component<HTMLDivElement>('div', { textContent: data.title }),
            ],
            alignItemsCenter: true,
        })
            .insert(this.element, 'afterbegin');
    }

    public getAction () {
        // create abonement
        this._processStatus.setStatus(ProcessStatusType.IDLE);
        return async () => {
            this._processStatus.setStatus(ProcessStatusType.PROCESS);
            const data = await convertFromInputToCreateData(this._data, this._clientId, this._logger);
            return createGroupLoyaltyAbonement(this._bearer, this._clientId, data, this._fetcher, this._logger)
                .then(() => this._processStatus.setStatus(ProcessStatusType.SUCCESS))
                .catch((error) => {
                    this._processStatus.setStatus(ProcessStatusType.ERROR);
                    throw error;
                });
        };
    }
}