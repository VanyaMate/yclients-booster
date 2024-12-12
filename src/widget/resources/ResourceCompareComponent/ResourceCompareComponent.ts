import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import {
    Resource,
} from '@/action/resources/types/resources.types.ts';


export type ResourceCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string,
        targetResource: Resource,
        clientResources: Array<Resource>,
    }

export class ResourceCompareComponent extends CompareComponent {
    private _clientId: string;
    private _targetResource: Resource;
    private _clientResources: Array<Resource>;
    private _clientResource?: Resource;

    constructor (props: ResourceCompareComponentProps) {
        const { clientResources, targetResource, clientId, ...other } = props;
        super(other);
        this._clientId        = clientId;
        this._targetResource  = targetResource;
        this._clientResources = clientResources;
        this._clientResource  = this._clientResources.find((resource) => resource.title === this._targetResource.title);
    }

    public get isValid (): boolean {
        return true;
    }

    protected _render (): void {
        this._header = new CompareHeader({
            targetHeaderData: this._targetResource.title,
            clientHeaderData: this._clientResource?.title,
            label           : 'Ресурс',
            variants        : this._clientResources.map((resource) => ({
                label: resource.title,
                value: resource.id,
            })),
            onVariantChange : (variant) => {
                this._clientResource = this._clientResources.find((resource) => resource.id === variant.value);
            },
            rows            : [],
        });
    }
}