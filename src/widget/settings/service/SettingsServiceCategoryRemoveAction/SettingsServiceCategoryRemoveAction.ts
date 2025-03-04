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
    removeSettingsServiceCategoryRequestAction,
} from '@/action/settings/service_categories/request-action/removeSettingsServiceCategory/removeSettingsServiceCategory.request-action.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { Details, DetailsType } from '@/shared/box/Details/Details.ts';


export type SettingsServiceCategoryRemoveActionProps =
    ActionComponentProps
    & {
        bearer: string;
        clientId: string;
        categoryId: string;
        categoryTitle: string;
        categoryData: SettingsServiceCategoryDataWithChildren;
        logger: ILogger;
    };

export class SettingsServiceCategoryRemoveAction extends ActionComponent<void, void> {
    private readonly _bearer: string;
    private readonly _clientId: string;
    private readonly _categoryId: string;
    private readonly _logger: ILogger;
    private readonly _process: ProcessStatus;
    private readonly _content: Col;

    constructor (props: SettingsServiceCategoryRemoveActionProps) {
        const {
                  bearer,
                  clientId,
                  categoryTitle,
                  categoryId,
                  categoryData,
                  logger,
                  ...other
              } = props;
        super(other);

        this._bearer     = bearer;
        this._clientId   = clientId;
        this._logger     = logger;
        this._categoryId = categoryId;
        this._logger     = logger;

        this._process = new ProcessStatus({ initialStatus: ProcessStatusType.NONE });
        this._content = new Col({
            rows: [
                new Row({
                    alignItemsCenter: true,
                    cols            : [
                        this._process,
                        new Component('span', { textContent: `[${ categoryId }] ${ categoryTitle }` }),
                    ],
                }),
                new Details({
                    type   : DetailsType.SECOND,
                    padding: 5,
                    header : new Component('div', {
                        textContent: 'Вместе с дочерними услугами',
                    }),
                    details: new Col({
                        rows: categoryData.children.map((service) => (
                            new Component('div', { textContent: `[${ service.id }] ${ service.title }` })
                        )),
                    }),
                }),
            ],
        });

        this._content.insert(this.element, 'afterbegin');
    }

    getAction (): () => Promise<void> {
        this._process.setStatus(ProcessStatusType.IDLE);
        return async () => {
            this._process.setStatus(ProcessStatusType.PROCESS);
            await removeSettingsServiceCategoryRequestAction(this._bearer, this._clientId, this._categoryId, this._logger)
                .then(() => this._process.setStatus(ProcessStatusType.SUCCESS))
                .catch(() => this._process.setStatus(ProcessStatusType.ERROR));
        };
    }
}