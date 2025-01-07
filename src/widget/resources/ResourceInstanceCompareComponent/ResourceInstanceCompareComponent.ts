import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { ResourceInstance } from '@/action/resources/types/resources.types.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
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
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { RESOURCE_INSTANCE_HEADER_TYPE } from '@/widget/header-types.ts';


export type ResourceInstanceCompareComponentProps =
    CompareComponentProps
    & {
        resourceId: string;
        clientInstances: Array<ResourceInstance>;
        targetInstance: ResourceInstance;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class ResourceInstanceCompareComponent extends CompareComponent<ResourceInstance> {
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
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);
        this._resourceId      = resourceId;
        this._clientInstances = clientInstances;
        this._targetInstance  = { ...targetInstance };
        this._clientInstance  = this._clientInstances.find((instance) => instance.title === targetInstance.title);
        this._promiseSplitter = new PromiseSplitter(1, 3);
        this._logger          = logger;
        this._fetcher         = fetcher;

        this._render();
    }

    public getAction (resourceId: string): () => Promise<ResourceInstance | null> {
        return super.getAction(resourceId ?? this._resourceId);
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        this._compareRows = [
            new CompareBox({
                level     : 5,
                title     : 'Информация',
                components: [
                    new CompareRow({
                        targetValue: new CompareTextValue({
                            value: this._targetInstance.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientInstance?.id,
                        }),
                        label      : 'Id',
                        validate   : false,
                        parent     : this,
                    }),
                ],
            }),
        ];

        this._header = new CompareHeader({
            targetHeaderData      : this._targetInstance.title,
            clientHeaderData      : this._clientInstance?.title,
            label                 : 'Экземпляр',
            type                  : RESOURCE_INSTANCE_HEADER_TYPE,
            rows                  : this._compareRows,
            variants              : this._clientInstances.map((instance) => ({
                label   : instance.title,
                selected: instance.title === this._clientInstance?.title,
                value   : instance.id,
            })),
            onVariantChange       : ((instanceVariant) => {
                this._clientInstance = this._clientInstances.find((instance) => instance.id === instanceVariant.value);
                this._render();
            }),
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
            onRename              : (title) => {
                this._targetInstance.title = title.trim();
            },
            parent                : this,
            compareType           : this._compareType,
        });

        this._revalidate(this._clientInstance);
        this._parent?.revalidateWithParents();
        this._header.insert(this.element, 'afterbegin');
    }

    protected async _action (resourceId: string) {
        if (this._clientInstance) {
            if (this._itemIsValid()) {
                return this._clientInstance;
            } else {
                return await updateResourceInstanceRequestAction(
                    resourceId,
                    this._clientInstance!.id,
                    { title: this._targetInstance.title },
                    this._fetcher,
                    this._logger,
                );
            }
        } else {
            if (!this._isNoCreateNew()) {
                const [ instance ] = await this._promiseSplitter.exec<ResourceInstance | null>([
                    {
                        chain: [
                            async () => createResourceInstanceRequestAction(resourceId, { title: this._targetInstance.title }, this._fetcher, this._logger),
                            async () => uploadResourceInstancesRequestAction(resourceId, this._logger),
                            async (instances: unknown) => {
                                return await findLastResourceInstanceByTitleAction(instances as Array<ResourceInstance>, this._targetInstance.title, this._logger);
                            },
                        ],
                    },
                ]);

                if (instance) {
                    return instance;
                }

                throw new Error('не удалось создать ресурс');
            }
            return null;
        }
    }
}