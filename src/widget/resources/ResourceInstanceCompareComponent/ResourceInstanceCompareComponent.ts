import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { ResourceInstance } from '@/action/resources/types/resources.types.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import {
    CompareTextInputValue,
} from '@/entity/compare/CompareValue/CompareTextInputValue/CompareTextInputValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    createResourceInstanceRequestAction,
} from '@/action/resources/request-action/createResourceInstance/createResourceInstance.request-action.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import {
    uploadResourceInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourceInstances/uploadResourceInstances.request-action.ts';
import {
    findLastResourceInstanceByTitleAction,
} from '@/action/resources/action/findLastResourceInstanceByTitle.action.ts';
import {
    updateResourceInstanceRequestAction,
} from '@/action/resources/request-action/updateResourceInstance/updateResourceInstance.request-action.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';


export type ResourceInstanceCompareComponentProps =
    CompareComponentProps
    & {
        resourceId: string;
        clientInstances: Array<ResourceInstance>;
        targetInstance: ResourceInstance;
        promiseSplitterRetry?: number;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class ResourceInstanceCompareComponent extends CompareComponent {
    private readonly _resourceId: string;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private readonly _promiseSplitter: PromiseSplitter;
    private readonly _clientInstances: Array<ResourceInstance>;
    private readonly _targetInstance: ResourceInstance;
    private _clientInstance?: ResourceInstance;

    constructor (props: ResourceInstanceCompareComponentProps) {
        const {
                  resourceId,
                  clientInstances,
                  targetInstance,
                  promiseSplitterRetry = 1,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);
        this._resourceId      = resourceId;
        this._clientInstances = clientInstances;
        this._targetInstance  = targetInstance;
        this._clientInstance  = this._clientInstances.find((instance) => instance.title === targetInstance.title);
        this._promiseSplitter = new PromiseSplitter(1, promiseSplitterRetry);
        this._logger          = logger;
        this._fetcher         = fetcher;

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this, this._clientInstance));
        this._render();
    }

    public getAction (resourceId: string = this._resourceId): () => Promise<ResourceInstance | null> {
        if (this._enabled) {
            if (this._clientInstance) {
                // update
                return async () => {
                    return await updateResourceInstanceRequestAction(
                        resourceId,
                        this._clientInstance!.id,
                        { title: this._targetInstance.title },
                        this._fetcher,
                        this._logger,
                    );
                };
            } else {
                // create
                return async () => {
                    let resourceInstance: ResourceInstance | null = null;

                    await this._promiseSplitter.exec([
                        {
                            chain: [
                                async () => createResourceInstanceRequestAction(resourceId, { title: this._targetInstance.title }, this._fetcher, this._logger),
                                async () => uploadResourceInstancesRequestAction(resourceId, this._logger),
                                async (instances: unknown) => {
                                    resourceInstance = await findLastResourceInstanceByTitleAction(instances as Array<ResourceInstance>, this._targetInstance.title);
                                },
                            ],
                        },
                    ]);

                    return resourceInstance;
                };
            }
        }

        return async () => null;
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        this._compareRows = [
            new CompareBox({
                level     : 5,
                title     : 'Основные настройки',
                components: [
                    new CompareRow({
                        targetValue: new CompareTextInputValue({
                            type       : 'text',
                            value      : this._targetInstance.title,
                            placeholder: 'Пусто',
                            onInput    : (title) => {
                                this._targetInstance.title = title;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientInstance?.title,
                        }),
                        label      : 'Название',
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            targetHeaderData      : this._targetInstance.title,
            clientHeaderData      : this._clientInstance?.title,
            label                 : 'Экземпляр',
            rows                  : this._compareRows,
            variants              : this._clientInstances.map((instance) => ({
                label   : instance.title,
                value   : instance.id,
                selected: instance.id === this._clientInstance?.id,
            })),
            onVariantChange       : ((instanceVariant) => {
                this._clientInstance = this._clientInstances.find((instance) => instance.id === instanceVariant.value);
                this._render();
                this.element.dispatchEvent(CompareEvent);
            }),
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
        });

        this._header.insert(this.element, 'afterbegin');
    }
}