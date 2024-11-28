import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    CompareType,
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';
import { CompareRowV3 } from '@/entity/compare/v3/CompareRowV3/CompareRowV3.ts';
import {
    SettingsServiceItemCompareComponent,
} from '@/widget/settings/service/SettingsServiceItemCompareComponent/SettingsServiceItemCompareComponent.ts';
import { CompareEvent } from '@/entity/compare/v3/CompareEvent.ts';


export type SettingsServiceCategoryCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        clientData: SettingsServiceCopyData;
        compareCategory: SettingsServiceCategoryDataWithChildren;
    };

export class SettingsServiceCategoryCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private readonly _clientId: string;
    private readonly _clientData: SettingsServiceCopyData;
    private readonly _compareCategory: SettingsServiceCategoryDataWithChildren;
    private _compareComponents: Array<ICompareComponent>                   = [];
    private _serviceComponents: Array<SettingsServiceItemCompareComponent> = [];
    private _originalCategory?: SettingsServiceCategoryDataWithChildren;
    private _header?: CompareHeaderV3;

    constructor (props: SettingsServiceCategoryCompareComponentProps) {
        const {
                  compareCategory,
                  clientData,
                  clientId,
                  ...other
              } = props;
        super('div', other);

        this._clientId         = clientId;
        this._clientData       = clientData;
        this._compareCategory  = compareCategory;
        this._originalCategory = this._clientData.tree.find((category) => category.title === this._compareCategory.title);

        this.element.addEventListener(CompareEvent.type, this._revalidate.bind(this));
        this._render();
    }

    get isValid () {
        return (
            this._currentCategoryIsValid() &&
            this._childrenIsValid()
        );
    }

    getAction (): () => Promise<void> {
        return async () => {
            if (this._originalCategory !== undefined) {
                if (this._currentCategoryIsValid()) {
                    if (this._childrenIsValid()) {
                        console.log('NOTHING');
                    } else {
                        Promise.all(this._serviceComponents.map((component) => component.getAction(this._originalCategory!.id.toString())()));
                    }
                } else {
                    console.log(`UPDATE CATEGORY [${ this._originalCategory.id }] FOR`, this._clientId);
                    Promise.all(this._serviceComponents.map((component) => component.getAction(this._originalCategory!.id.toString())()));
                }
            } else {
                const id = Math.random().toString(16);
                console.log('CREATE NEW CATEGORY FOR', id, this._clientId);
                Promise.all(this._serviceComponents.map((component) => component.getAction(id)()));
            }
        };
    }

    private _currentCategoryIsValid () {
        return (
            this._compareCategory !== undefined &&
            this._compareCategory.title === this._originalCategory?.title &&
            this._compareComponents.every((component) => component.isValid)
        );
    }

    private _childrenIsValid () {
        return this._serviceComponents.every((component) => component.isValid);
    }

    private _render () {
        this.element.innerHTML  = ``;
        this._serviceComponents = this._compareCategory.children.map((service) => (
            new SettingsServiceItemCompareComponent({
                clientId      : this._clientId,
                compareService: service,
                clientServices: this._originalCategory?.children,
            })
        ));

        this._compareComponents = [
            new CompareRowV3({
                dataOriginal: this._compareCategory.booking_title,
                dataCompare : this._originalCategory?.booking_title,
                label       : 'Букинг заголовок',
            }),
            new CompareRowV3({
                dataOriginal: this._compareCategory.sex ? 'Муж' : 'Жен',
                dataCompare : this._originalCategory?.sex === undefined
                              ? undefined : this._originalCategory.sex ? 'Муж'
                                                                       : 'Жен',
                label       : 'Пол',
            }),
            new CompareRowV3({
                dataOriginal: this._compareCategory.services_count.toString(),
                dataCompare : this._originalCategory?.services_count.toString(),
                label       : 'Количество',
            }),
        ];

        this._header = new CompareHeaderV3({
            headerOriginal : this._compareCategory.title,
            headerCompare  : this._originalCategory?.title,
            label          : 'Категория',
            variants       : this._clientData.tree
                .map((category) => ({
                    label   : category.title,
                    value   : category.id.toString(),
                    selected: category.id === this._originalCategory?.id,
                })),
            rows           : [
                ...this._compareComponents,
                ...this._serviceComponents,
            ],
            onVariantChange: (e) => {
                this._originalCategory = this._clientData.tree.find((category) => category.id.toString() === e.value);
                this._render();
            },
        });

        this._revalidate();
        this._header.insert(this.element, 'beforeend');
    }

    private _revalidate () {
        console.log('Revalidate');

        if (this._originalCategory === undefined) {
            this._header?.setValidationType(CompareType.NO_EXIST);
        } else if (!this.isValid) {
            this._header?.setValidationType(CompareType.NO_VALID);
        } else {
            this._header?.setValidationType(CompareType.VALID);
        }
    }
}