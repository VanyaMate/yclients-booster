import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareComponent,
} from '@/entity/compare/v3/Compare.types.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';


export type SettingsServiceCategoriesCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        clientData: SettingsServiceCopyData;
        compareData: SettingsServiceCopyData;
    };

export class SettingsServiceCategoriesCompareComponent extends Component<HTMLDivElement> implements ICompareComponent {
    private _clientId: string;
    private _clientData: SettingsServiceCopyData;
    private _compareData: SettingsServiceCopyData;

    constructor (props: SettingsServiceCategoriesCompareComponentProps) {
        const { compareData, clientData, clientId, ...other } = props;
        super('div', other);
        this._clientId    = clientId;
        this._clientData  = clientData;
        this._compareData = compareData;

        this._render();
    }

    get isValid () {
        return true;
    }

    private _render () {
        this.element.innerHTML = ``;

        const rows = this._compareData.tree.map((category) => (
            new SettingsServiceCategoryCompareComponent({
                compareCategory: category,
                clientId       : this._clientId,
                clientData     : this._clientData,
            })
        ));

        new Col({ rows }).insert(this.element, 'beforeend');
        new Button({
            textContent: 'Получить',
            onclick    : () => {
                const actions = rows.map((row) => row.getAction());
                Promise.all(actions.map((action) => action()));
            },
        }).insert(this.element, 'beforeend');
    }
}