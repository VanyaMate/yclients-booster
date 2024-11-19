import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IPromisableComponent,
    PromiseCallback,
} from '@/shared/component/IPromisableComponent.interface.ts';
import {
    ICompareComponent,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';
import {
    SettingsServiceCategoryData,
    SettingsServiceCategoryDataWithChildren,
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { Details, DetailsType } from '@/shared/box/Details/Details.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SettingsServiceCompare,
} from '@/widget/settings/service/SettingsServiceCompare/SettingsServiceCompare.ts';
import {
    CompareProcess,
} from '@/entity/compare/CompareProcess/CompareProcess.ts';
import {
    CompareStateIconType,
} from '@/entity/compare/CompareStateIcon/CompareStateIcon.ts';


export type SettingsServiceCategoriesCompareProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        dataFrom: SettingsServiceCategoryDataWithChildren;
        dataTo?: SettingsServiceCategoryData | null;
        settingsCopyData: SettingsServiceCopyData;
    }

export class SettingsServiceCategoriesCompare extends Component<HTMLDivElement> implements IPromisableComponent<HTMLDivElement>,
                                                                                           ICompareComponent<HTMLDivElement> {
    private _header: CompareHeader | null               = null;
    private _dataTo: SettingsServiceCategoryData | null = null;
    private _dataFrom: SettingsServiceCategoryDataWithChildren;
    private _copyData: SettingsServiceCopyData;
    private _services: Array<SettingsServiceCompare>    = [];

    constructor (props: SettingsServiceCategoriesCompareProps) {
        const { dataFrom, dataTo, settingsCopyData, ...other } = props;
        super('div', other);

        this._dataFrom = dataFrom;
        this._copyData = settingsCopyData;
        this._dataTo   = dataTo ?? null;

        this._render();
    }

    private _render () {
        this._services         = [];
        this.element.innerHTML = '';

        // render header
        this._header = new CompareHeader({
            titleFrom      : this._dataFrom.title,
            titleTo        : this._dataTo?.title,
            variants       : this._copyData.tree.map((category) => ({
                id   : category.id.toString(),
                title: category.title,
            })),
            idTo           : this._dataTo?.id.toString(),
            modalLabel     : 'Выбрать категорию',
            onVariantChange: (id: string) => {
                this._dataTo = this._copyData.tree.find((item) => item.id.toString() === id) ?? null;
                this._render();
            },
            label          : 'Категория услуг',
        });

        // render rows

        // render services
        const categoryChildren = this._copyData.tree.find((item) => item.id.toString() === this._dataTo?.id.toString());
        this._services         = this._dataFrom.children.map((service) => {
            return new SettingsServiceCompare({
                dataFrom: service,
                dataTo  : categoryChildren?.children.find((childService) => childService.title === service.title) ?? null,
            });
        });

        new CompareProcess({
            init   : this.getValid() ? CompareStateIconType.SUCCESS
                                     : CompareStateIconType.IDLE,
            content: new Details({
                header : this._header,
                details: new Col({
                    rows: this._services,
                }),
                type   : DetailsType.SECOND,
            }),
        })
            .insert(this.element, 'afterbegin');
    }

    getPromises (): Array<PromiseCallback> {
        return [
            async () => {

            },
        ];
    }

    getValid (): boolean {
        return true;
    }
}