import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    getSettingsServiceCategoriesFullDataRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategoriesFullData/getSettingsServiceCategoriesFullData.request-action.ts';
import {
    SettingsServiceCategoryDataWithChildren, SettingsServiceCategoryResponse,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import css from './SettingsServiceGetIdsForm.module.css';
import { Toggle } from '@/shared/input/Toggle/Toggle.ts';


export type SettingsServiceGetIdsFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        bearer: string;
        clientId: string;
    };

export class SettingsServiceGetIdsForm extends Component<HTMLDivElement> {
    private readonly _bearer: string;
    private readonly _clientId: string;
    private readonly _logger: Logger;
    private readonly _content: Col;
    private readonly _contentTables: Col;
    private _categories: SettingsServiceCategoryResponse | null = null;
    private _sortByCategories: boolean                          = true;

    constructor (props: SettingsServiceGetIdsFormProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);

        this._bearer         = bearer;
        this._clientId       = clientId;
        this._logger         = new Logger({});
        const uploadData     = new Button({
            textContent: 'Загрузить ID-шники',
            onclick    : () => {
                toggleSortType.setDisable(true);
                uploadData.setLoading(true);
                this._renderList()
                    .then(() => uploadData.remove())
                    .catch(() => uploadData.element.textContent = 'Попробовать еще раз')
                    .finally(() => {
                        toggleSortType.setDisable(false);
                        uploadData.setLoading(false);
                    });
            },
        });
        const toggleSortType = new Toggle({
            textContent: 'Сортировать по категориям',
            value      : this._sortByCategories,
            onChange   : (status) => {
                console.log('status', status);
                this._sortByCategories = status;
                this._renderTableBySortType();
            },
        });
        this._contentTables  = new Col({ rows: [] });
        this._content        = new Col({ rows: [ this._logger, uploadData, toggleSortType, this._contentTables ] });
        this._content.insert(this.element, 'afterbegin');
        this.element.classList.add(css.container);
    }

    private _renderTableBySortType () {
        this._contentTables.clear();
        if (this._sortByCategories) {
            if (this._categories) {
                this._categories.list.forEach(this._renderTableByCategorySorted.bind(this));
            }
        } else {
            if (this._categories) {
                this._renderTableWithoutSorting(this._categories.list);
            }
        }
    }

    private async _renderList () {
        this._categories = await getSettingsServiceCategoriesFullDataRequestAction(this._bearer, this._clientId, this._logger);
        this._renderTableBySortType();
    }

    private _renderTableByCategorySorted (category: SettingsServiceCategoryDataWithChildren) {
        const label         = new LabelDivider({ textContent: category.title });
        const categoryTable = new Table({ header: [ 'Id', 'Заголовок категории' ] });
        categoryTable.addRow([ category.id.toString(), category.title ]);

        const serviceTable = new Table({ header: [ 'Id', 'Заголовок услуги' ] });
        category.children.forEach((service) => serviceTable.addRow([ service.id.toString(), service.title ]));

        this._contentTables.add(label);
        this._contentTables.add(categoryTable);
        this._contentTables.add(serviceTable);
    }

    private _renderTableWithoutSorting (categories: Array<SettingsServiceCategoryDataWithChildren>) {
        const serviceTable = new Table({ header: [ 'Id', 'Заголовок услуги' ] });

        categories.forEach((category) => {
            category.children.forEach((service) => {
                serviceTable.addRow([ service.id.toString(), service.title ]);
            });
        });

        this._contentTables.add(serviceTable);
    }
}