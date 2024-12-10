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


export type ResourceInstanceCompareComponentProps =
    CompareComponentProps
    & {
        clientId: string;
        clientInstances: Array<ResourceInstance>;
        targetInstance: ResourceInstance;
    };

export class ResourceInstanceCompareComponent extends CompareComponent {
    private _clientInstances: Array<ResourceInstance>;
    private _targetInstance: ResourceInstance;
    private _clientInstance?: ResourceInstance;
    private _clientId: string;

    constructor (props: ResourceInstanceCompareComponentProps) {
        const { clientId, clientInstances, targetInstance, ...other } = props;
        super(other);
        this._clientId        = clientId;
        this._clientInstances = clientInstances;
        this._targetInstance  = targetInstance;
        this._clientInstance  = this._clientInstances.find((instance) => instance.title === targetInstance.title);
    }

    public get isValid (): boolean {
        throw new Error('Method not implemented.');
    }

    public getAction () {
        if (this._enabled) {
            console.log(this._clientId);
        }
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