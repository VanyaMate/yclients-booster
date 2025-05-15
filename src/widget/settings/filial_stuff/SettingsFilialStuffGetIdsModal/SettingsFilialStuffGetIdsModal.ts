import { ModalButton } from '@/shared/buttons/ModalButton/ModalButton.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import {
    getStuffListFromApiRequestAction,
    StuffFullItem,
} from '@/action/settings/stuff/getStuffListFromApi.request-action.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { Modal } from '@/shared/modal/Modal/Modal.ts';


export type SettingsFilialStuffGetIdsModalProps =
    {
        bearer: string;
        clientId: string;
    };

export class SettingsFilialStuffGetIdsModal extends ModalButton {
    private readonly _logger: Logger = new Logger({});
    private readonly _content: Col;
    private readonly _bearer: string;
    private readonly _clientId: string;

    constructor (props: SettingsFilialStuffGetIdsModalProps) {
        const { clientId, bearer } = props;
        const col                  = new Col({ rows: [] });
        super({
            textContent: 'Узнать ID сотрудников',
            styleType  : ButtonStyleType.PRIMARY,
            modalProps : {
                label      : 'Список сотрудников',
                content    : col,
                preferWidth: Modal.getPreferWidthByNesting(0),
            },
        });
        this._bearer   = bearer;
        this._clientId = clientId;

        this._content = col;
        this._content.add(this._logger);

        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const getStuffButton = new Button({
            textContent: 'Получить список сотрудников',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : () => {
                getStuffButton.setLoading(true);
                getStuffListFromApiRequestAction(this._bearer, this._clientId, this._logger)
                    .then((list) => {
                        getStuffButton.remove();
                        this._renderTable(list);
                    });
            },
        });
        this._content.add(getStuffButton);
    }

    private _renderTable (data: Array<StuffFullItem>) {
        const table = new Table({
            header: [ 'Id', 'Имя', 'Уволен', 'Online' ],
        });
        data.forEach((empl) => table.addRow([
            empl.id,
            empl.name,
            empl.is_fired ? 'да' : 'нет',
            empl.is_online ? 'да' : 'нет',
        ]));
        this._content.add(table);
    }
}