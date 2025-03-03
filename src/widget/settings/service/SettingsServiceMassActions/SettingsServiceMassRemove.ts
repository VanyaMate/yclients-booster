import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    getSettingsServiceCategoriesFullDataRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServiceCategoriesFullData/getSettingsServiceCategoriesFullData.request-action.ts';
import css from './SettingsServiceMassRemove.module.css';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';


export type SettingsServiceMassRemoveProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        bearer: string;
        clientId: string;
    };

export class SettingsServiceMassRemove extends Component<HTMLDivElement> {
    private readonly _bearer: string;
    private readonly _clientId: string;
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col   = new Col({ rows: [ this._logger ] });

    /*    private readonly _categoriesToRemove: Array<string> = [];
     private readonly _servicesToRemove: Array<string>   = [];*/

    constructor (props: SettingsServiceMassRemoveProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);

        this.element.classList.add(css.container);

        this._bearer   = bearer;
        this._clientId = clientId;

        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const getAllButton = new Button({
            textContent: 'Получить список всех категорий и услуг',
            onclick    : async () => {
                getAllButton.setLoading(true);
                getAllButton.element.textContent = 'Получение..';
                this._renderList()
                    .then(() => {
                        getAllButton.remove();
                    })
                    .catch(() => {
                        getAllButton.setLoading(false);
                        getAllButton.element.textContent = 'Попробовать еще раз';
                    });
            },
        });

        this._content.add(getAllButton);
    }

    private async _renderList () {
        const categories = await getSettingsServiceCategoriesFullDataRequestAction(this._bearer, this._clientId, this._logger);

        console.log(categories);
    }
}