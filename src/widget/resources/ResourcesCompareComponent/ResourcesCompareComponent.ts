import {
    CompareComponentV3,
} from '@/entity/compare/v3/CompareComponent/CompareComponentV3.ts';
import { ComponentPropsOptional } from '@/shared/component/Component.ts';


export type ResourcesCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {}

// get all https://yclients.com/resources/1092329
// get all instances https://yclients.com/resource_instances/101669

export class ResourcesCompareComponent extends CompareComponentV3 {
    public get isValid (): boolean {
        throw new Error('Method not implemented.');
    }
}