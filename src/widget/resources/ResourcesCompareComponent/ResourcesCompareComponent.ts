import {
    CompareComponent, CompareComponentProps,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { Resource } from '@/action/resources/types/resources.types.ts';


export type ResourcesCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        bearer: string;
        clientData: Array<Resource>;
        targetData: Array<Resource>;
    };

export class ResourcesCompareComponent extends CompareComponent {
    constructor (props: ResourcesCompareComponentProps) {
        super(props);
    }

    public get isValid (): boolean {
        throw new Error('Method not implemented.');
    }

    protected _render (): void {
    }
}