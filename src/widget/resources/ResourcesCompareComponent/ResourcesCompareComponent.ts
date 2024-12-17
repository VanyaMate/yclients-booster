import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { Resource } from '@/action/resources/types/resources.types.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    ResourceCompareComponent,
} from '@/widget/resources/ResourceCompareComponent/ResourceCompareComponent.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type ResourcesCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        clientData: Array<Resource>;
        targetData: Array<Resource>;
        logger?: ILogger;
        fetcher?: IFetcher;
        promiseSplitter?: {
            limit?: number;
            retry?: number;
        };
    };

export class ResourcesCompareComponent extends CompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: Array<Resource>;
    private readonly _targetData: Array<Resource>;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private readonly _promiseSplitter: PromiseSplitter;
    private _resourceCompareComponents: Array<ResourceCompareComponent> = [];

    constructor (props: ResourcesCompareComponentProps) {
        const {
                  clientId,
                  clientData,
                  targetData,
                  logger,
                  fetcher,
                  promiseSplitter,
                  ...other
              } = props;
        super(other);

        this._clientId        = clientId;
        this._clientData      = clientData;
        this._targetData      = targetData;
        this._logger          = logger;
        this._fetcher         = fetcher;
        this._promiseSplitter = new PromiseSplitter(
            promiseSplitter?.limit ?? PROMISE_SPLITTER_MAX_REQUESTS,
            promiseSplitter?.retry ?? PROMISE_SPLITTER_MAX_RETRY,
        );
    }

    public get isValid (): boolean {
        if (this._enabled) {
            return this._resourceCompareComponents.every((component) => component.isValid);
        }

        return true;
    }

    public getAction (): () => Promise<Array<Resource>> {
        if (this._enabled) {
            return async () => {
                const resources: Array<unknown> = await this._promiseSplitter.exec(
                    this._resourceCompareComponents.map(
                        (component) => ({ chain: [ component.getAction() ] }),
                    ),
                );

                return resources.filter(Boolean) as Array<Resource>;
            };
        }

        return async () => [];
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        this._resourceCompareComponents = this._targetData.map((resource) => (
            new ResourceCompareComponent({
                clientId       : this._clientId,
                targetResource : resource,
                clientResources: this._clientData,
                logger         : this._logger,
                fetcher        : this._fetcher,
            })
        ));

        new Col({ rows: this._resourceCompareComponents }).insert(this.element, 'afterbegin');
    }
}