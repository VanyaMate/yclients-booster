import {
    CompareComponent,
    CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    Resource,
    ResourceInstance,
} from '@/action/resources/types/resources.types.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import {
    ResourceInstanceCompareComponent,
} from '@/widget/resources/ResourceInstanceCompareComponent/ResourceInstanceCompareComponent.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS,
    PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    createResourceRequestAction,
} from '@/action/resources/request-action/createResource/createResource.request-action.ts';
import {
    uploadResourceByTitleRequestAction,
} from '@/action/resources/request-action/uploadResourceByTitle/uploadResourceByTitle.request-action.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    updateResourceRequestAction,
} from '@/action/resources/request-action/updateResource/updateResource.request-action.ts';
import { CompareType } from '@/entity/compare/Compare.types.ts';
import { CompareEvent } from '@/entity/compare/CompareEvent.ts';
import {
    deleteResourceInstanceRequestAction,
} from '@/action/resources/request-action/deleteResourceInstance/deleteResourceInstance.request-action.ts';
import {
    CompareTextareaValue,
} from '@/entity/compare/CompareValue/CompareTextareaValue/CompareTextareaValue.ts';


export type ResourceCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string,
        targetResource: Resource,
        clientResources: Array<Resource>,
        logger?: ILogger,
        fetcher?: IFetcher,
        promiseSplitter?: {
            limit?: number,
            retry?: number,
        },
    }

export class ResourceCompareComponent extends CompareComponent<Resource> {
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private readonly _promiseSplitter: PromiseSplitter;
    private readonly _clientId: string;
    private readonly _targetResource: Resource;
    private readonly _clientResources: Array<Resource>;
    private _clientResource?: Resource;
    private _resourceInstancesCompareComponents: Array<ResourceInstanceCompareComponent> = [];

    constructor (props: ResourceCompareComponentProps) {
        const {
                  clientResources,
                  targetResource,
                  clientId,
                  logger,
                  fetcher,
                  promiseSplitter,
                  ...other
              } = props;
        super(other);
        this._clientId        = clientId;
        this._targetResource  = { ...targetResource };
        this._clientResources = clientResources;
        this._logger          = logger;
        this._fetcher         = fetcher;
        this._clientResource  = this._clientResources.find((resource) => resource.title === this._targetResource.title);
        this._promiseSplitter = new PromiseSplitter(
            promiseSplitter?.limit ?? PROMISE_SPLITTER_MAX_REQUESTS,
            promiseSplitter?.retry ?? PROMISE_SPLITTER_MAX_RETRY,
        );

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this, this._clientResource));
        this._render();
    }

    protected async _action (): Promise<Resource | null> {
        if (this._clientResource) {
            const resourceId = this._clientResource.id;
            if (this._itemIsValid()) {
                if (this._childrenIsValid()) {
                    // return item
                    return this._clientResource;
                } else {
                    // action children
                    this._clientResource.instances = await this._promiseSplitter.exec<ResourceInstance>(
                        this._resourceInstancesCompareComponents.map(
                            (component) => ({ chain: [ component.getAction(resourceId) ] }),
                        ),
                    );
                    return this._clientResource;
                    // return item
                }
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    const resource     = await updateResourceRequestAction(
                        this._clientId,
                        this._clientResource!.id,
                        {
                            title      : this._targetResource.title,
                            description: this._targetResource.description,
                        },
                        this._fetcher,
                        this._logger,
                    );
                    resource.instances = this._clientResource.instances;
                    return resource;
                    // return item
                } else {
                    // update item
                    const resource     = await updateResourceRequestAction(
                        this._clientId,
                        this._clientResource!.id,
                        {
                            title      : this._targetResource.title,
                            description: this._targetResource.description,
                        },
                        this._fetcher,
                        this._logger,
                    );
                    resource.instances = await this._promiseSplitter.exec<ResourceInstance>(
                        this._resourceInstancesCompareComponents.map(
                            (component) => ({ chain: [ component.getAction(resource.id) ] }),
                        ),
                    );
                    return resource;
                    // action children
                    // return item
                }
            }
        } else {
            if (!this._isNoCreateNew()) {
                // create item
                await createResourceRequestAction(
                    this._clientId,
                    {
                        title      : this._targetResource.title,
                        description: this._targetResource.description,
                    },
                    this._fetcher,
                    this._logger,
                );

                const resource = await uploadResourceByTitleRequestAction(this._clientId, this._targetResource.title, this._logger);

                if (resource.instances.length === 1) {
                    await deleteResourceInstanceRequestAction(resource.id, resource.instances[0].id, this._logger);
                }

                if (!this._childrenIsValid()) {
                    resource.instances = await this._promiseSplitter.exec(
                        this._resourceInstancesCompareComponents.map(
                            (component) => ({ chain: [ component.getAction(resource.id) ] }),
                        ),
                    );
                }

                // return item
                return resource;
            }

            return null;
        }
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        this._compareRows = [
            new CompareBox({
                level     : 4,
                title     : 'Информация',
                components: [
                    new CompareRow({
                        targetValue: new CompareTextValue({
                            value: this._targetResource.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientResource?.id,
                        }),
                        label      : 'Id',
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                level     : 4,
                title     : 'Настройки ресурса',
                components: [
                    new CompareRow({
                        label      : `Описание`,
                        targetValue: new CompareTextareaValue({
                            placeholder: 'Пусто',
                            value      : this._targetResource.description,
                            onInput    : (description) => {
                                this._targetResource.description = description;
                            },
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientResource?.description,
                        }),
                    }),
                ],
            }),
        ];

        this._resourceInstancesCompareComponents = this._targetResource.instances.map((instance) => (
            new ResourceInstanceCompareComponent({
                resourceId     : this._targetResource.id,
                targetInstance : instance,
                clientInstances: this._clientResource?.instances ?? [],
                logger         : this._logger,
                fetcher        : this._fetcher,
            })
        ));

        this._compareChildren = [
            new CompareBox({
                level     : 3,
                title     : 'Экземпляры ресурса',
                components: this._resourceInstancesCompareComponents,
            }),
        ];

        this._header = new CompareHeader({
            targetHeaderData      : this._targetResource.title,
            clientHeaderData      : this._clientResource?.title,
            label                 : 'Ресурс',
            variants              : this._clientResources.map((resource) => ({
                label   : resource.title,
                value   : resource.id,
                selected: resource.title === this._clientResource?.title,
            })),
            onVariantChange       : (variant) => {
                this._clientResource = this._clientResources.find((resource) => resource.id === variant.value);
                this._render();
                this.element.dispatchEvent(CompareEvent);
            },
            rows                  : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            onActivateAll         : () => this._setCompareType(CompareType.ALL),
            onActivateOnlyItem    : () => this._setCompareType(CompareType.ITEM),
            onActivateOnlyChildren: () => this._setCompareType(CompareType.CHILDREN),
            onDeactivate          : () => this._setCompareType(CompareType.NONE),
            onRename              : (title) => {
                this._targetResource.title = title;
            },
        });

        this._header.insert(this.element, 'afterbegin');
    }
}