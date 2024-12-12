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
import {
    createResourceInstanceRequestAction,
} from '@/action/resources/request-action/createResourceInstance/createResourceInstance.request-action.ts';
import {
    uploadResourceInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourceInstances/uploadResourceInstances.request-action.ts';


type AsyncCallback = (data: any) => Promise<any>;

export type ResourceInstanceCompareComponentProps =
    CompareComponentProps
    & {
        resourceId: string;
        clientInstances: Array<ResourceInstance>;
        targetInstance: ResourceInstance;
    };

export class ResourceInstanceCompareComponent extends CompareComponent {
    private readonly _resourceId: string;
    private _clientInstances: Array<ResourceInstance>;
    private _targetInstance: ResourceInstance;
    private _clientInstance?: ResourceInstance;

    constructor (props: ResourceInstanceCompareComponentProps) {
        const { resourceId, clientInstances, targetInstance, ...other } = props;
        super(other);
        this._resourceId      = resourceId;
        this._clientInstances = clientInstances;
        this._targetInstance  = targetInstance;
        this._clientInstance  = this._clientInstances.find((instance) => instance.title === targetInstance.title);
    }

    public get isValid (): boolean {
        if (this._enabled) {
            return true;
        }

        return true;
    }

    public getActions (): Array<AsyncCallback> {
        if (this._enabled) {
            return [
                async () => createResourceInstanceRequestAction(this._resourceId, { title: this._targetInstance.title }),
                async () => uploadResourceInstancesRequestAction(this._resourceId),
                async (resourceInstances: Array<ResourceInstance>) => {
                    console.log(resourceInstances.find((resource) => resource.title === this._targetInstance.title), resourceInstances, this._targetInstance.title);
                    return;
                },
            ];
        }

        return [];
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
            targetHeaderData: this._targetInstance.title,
            clientHeaderData: this._clientInstance?.title,
            label           : 'Экземпляр',
            rows            : this._compareRows,
            variants        : this._clientInstances.map((instance) => ({
                label   : instance.title,
                value   : instance.id,
                selected: instance.id === this._clientInstance?.id,
            })),
            onVariantChange : ((instanceVariant) => {
                this._clientInstance = this._clientInstances.find((instance) => instance.id === instanceVariant.value);
            }),
        });

        this._header.insert(this.element, 'afterbegin');
    }
}