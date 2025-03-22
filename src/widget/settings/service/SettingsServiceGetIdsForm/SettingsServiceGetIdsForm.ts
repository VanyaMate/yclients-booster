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
    SettingsServiceCategoryDataWithChildren,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { LabelDivider } from '@/shared/divider/LabelDivider/LabelDivider.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import css from './SettingsServiceGetIdsForm.module.css';


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

    constructor (props: SettingsServiceGetIdsFormProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);

        this._bearer     = bearer;
        this._clientId   = clientId;
        this._logger     = new Logger({});
        const uploadData = new Button({
            textContent: 'Загрузить ID-шники',
            onclick    : () => {
                this._renderList()
                    .then(() => uploadData.remove())
                    .catch(() => uploadData.element.textContent = 'Попробовать еще раз');
            },
        });
        this._content    = new Col({ rows: [ this._logger, uploadData ] });
        this._content.insert(this.element, 'afterbegin');
        this.element.classList.add(css.container);
    }

    private async _renderList () {
        const categories = await getSettingsServiceCategoriesFullDataRequestAction(this._bearer, this._clientId, this._logger);
        categories.list.forEach(this._renderTable.bind(this));
    }

    private _renderTable (category: SettingsServiceCategoryDataWithChildren) {
        const label         = new LabelDivider({ textContent: category.title });
        const categoryTable = new Table({ header: [ 'Id', 'Заголовок категории' ] });
        categoryTable.addRow([ category.id.toString(), category.title ]);

        const serviceTable = new Table({ header: [ 'Id', 'Заголовок услуги' ] });
        category.children.forEach((service) => serviceTable.addRow([ service.id.toString(), service.title ]));

        this._content.add(label);
        this._content.add(categoryTable);
        this._content.add(serviceTable);
    }
}