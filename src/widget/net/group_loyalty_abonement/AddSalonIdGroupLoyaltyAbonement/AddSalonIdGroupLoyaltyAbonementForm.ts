import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type AddSalonIdGroupLoyaltyAbonementFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        bearer: string;
        clientId: string;
    };

export class AddSalonIdGroupLoyaltyAbonementForm extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _content: Col;

    constructor (props: AddSalonIdGroupLoyaltyAbonementFormProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);
        this._content = new Col({ rows: [] });
        this._logger  = new Logger({});
        console.log(this._logger);
    }

    // продолжить тут
    public _renderInitialForm () {
        const uploadDataButton = new Button({
            textContent: 'Загрузить данные',
            onclick    : () => {
                uploadDataButton.setLoading(true);
            },
        });
        this._content.add(uploadDataButton);
    }
}