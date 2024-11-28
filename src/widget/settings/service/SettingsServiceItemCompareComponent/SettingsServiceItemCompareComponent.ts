import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareType,
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { CompareRowV3 } from '@/entity/compare/v3/CompareRowV3/CompareRowV3.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';


export type SettingsServiceItemCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        // Сохранить / Обновить для этого пользователя
        clientId: string;
        // Список клиентских сервисов в той же категории
        clientServices?: Array<SettingsServiceData>;
        // Сравниваемый сервис
        compareService: SettingsServiceData;
    };

export class SettingsServiceItemCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private _clientId: string;
    private _clientServices: Array<SettingsServiceData>;
    private _compareService: SettingsServiceData;
    private _compareComponents: Array<ICompareComponent> = [];
    private _originalService?: SettingsServiceData;
    private _header?: CompareHeaderV3;

    constructor (props: SettingsServiceItemCompareComponentProps) {
        const {
                  clientServices = [],
                  clientId,
                  compareService,
                  ...other
              } = props;
        super('div', other);

        this._clientId        = clientId;
        this._clientServices  = clientServices;
        this._compareService  = compareService;
        this._originalService = this._clientServices.find((service) => service.title === this._compareService.title);

        this._render();
    }

    get isValid () {
        return (
            this._compareService !== undefined &&
            this._compareService.title === this._originalService?.title &&
            this._compareComponents.every((component) => component.isValid)
        );
    }

    getAction (categoryId: string): () => Promise<void> {
        return async () => {
            if (this._originalService !== undefined) {
                if (this.isValid) {
                    console.log('NOTHING');
                } else {
                    console.log(`UPDATE SERVICE "${ this._originalService.title }" [${ this._originalService.id }] FOR [${ categoryId }] :${ this._clientId }`);
                }
            } else {
                console.log(`CREATE NEW SERVICE "${ this._compareService.title }" FOR [${ categoryId }] :${ this._clientId }`);
            }
        };
    }

    private _render () {
        this.element.innerHTML  = ``;
        this._compareComponents = [
            new CompareRowV3({
                dataOriginal: this._compareService.booking_title,
                dataCompare : this._originalService?.booking_title,
                label       : 'Букинг заголовок',
            }),
            new CompareRowV3({
                dataOriginal: this._compareService.comment,
                dataCompare : this._originalService?.comment,
                label       : 'Комментарий',
            }),
            new CompareRowV3({
                dataOriginal: this._compareService.discount.toString(),
                dataCompare : this._originalService?.discount.toString(),
                label       : 'Скидка',
            }),
        ];

        this._header = new CompareHeaderV3({
            headerOriginal : this._compareService.title,
            headerCompare  : this._originalService?.title,
            label          : 'Сервис',
            variants       : this._clientServices
                .map((service) => ({
                    label   : service.title,
                    value   : service.id.toString(),
                    selected: service.id === this._originalService?.id,
                })),
            rows           : this._compareComponents,
            onVariantChange: (e) => {
                this._originalService = this._clientServices.find((service) => service.id.toString() === e.value);
                this._render();
                this.element.dispatchEvent(CompareEvent);
            },
        });

        if (this._originalService === undefined) {
            this._header.setValidationType(CompareType.NO_EXIST);
        } else if (!this.isValid) {
            this._header.setValidationType(CompareType.NO_VALID);
        } else {
            this._header.setValidationType(CompareType.VALID);
        }

        this._header.insert(this.element, 'beforeend');
    }
}