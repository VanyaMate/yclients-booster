import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    getGroupLoyaltyAmonements,
} from '@/action/net/group-loyalty-abonement/getGroupLoyaltyAmonements.ts';
import {
    getLoyaltyAmonement,
} from '@/action/net/group-loyalty-abonement/getLoyaltyAmonement.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import {
    GroupLoyaltyFullDataResponse,
} from '@/action/net/group-loyalty-abonement/types/types.ts';
import {
    updateGroupLoyaltyAbonement,
} from '@/action/net/group-loyalty-abonement/updateGroupLoyaltyAbonement.ts';
import {
    convertFromFullDataToUpdateData,
} from '@/action/net/group-loyalty-abonement/converter/convertFromFullDataToUpdateData.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';

// 557451


export type AddSalonIdWithSettingsGroupLoyaltyAbonementProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        bearer: string;
        clientId: string;
    };

export class AddSalonIdWithSettingsGroupLoyaltyAbonement extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _fetcher: IFetcher;
    private readonly _content: Col;
    private readonly _bearer: string;
    private readonly _clientId: string;

    constructor (props: AddSalonIdWithSettingsGroupLoyaltyAbonementProps) {
        const { bearer, clientId, ...other } = props;
        super('div', other);
        this._content  = new Col({ rows: [] });
        this._logger   = new Logger({});
        this._fetcher  = new MemoFetch();
        this._bearer   = bearer;
        this._clientId = clientId;
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    // продолжить тут
    public _renderInitialForm () {
        const clientEtalonIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала который должен быть',
        });
        const clientIdInput       = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала который нужно добавить',
        });
        const uploadDataButton    = new Button({
            textContent: 'Добавить',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : async () => {
                const clientIdEtalon = clientEtalonIdInput.getValue();
                const clientIdToAdd  = clientIdInput.getValue();

                if (clientIdEtalon && clientIdToAdd) {
                    uploadDataButton.setLoading(true);

                    const abonements = await getGroupLoyaltyAmonements(this._bearer, this._clientId, 1, [ 'attached_salon_ids', 'availability', 'online_sale_image' ], this._logger);
                    await new PromiseSplitter(3, 1)
                        .exec(
                            abonements.map((abonement) => ({
                                chain: [
                                    () => getLoyaltyAmonement(this._bearer, this._clientId, abonement.id.toString(), [ 'balance_container', 'abonements_count', 'attached_salon_ids' ], this._logger),
                                    async (fulldata: GroupLoyaltyFullDataResponse) => {
                                        if (
                                            fulldata.attached_salon_ids.includes(Number(clientIdToAdd)) ||
                                            !fulldata.attached_salon_ids.includes(Number(clientIdEtalon))
                                        ) {
                                            return fulldata;
                                        }

                                        fulldata.attached_salon_ids.push(Number(clientIdToAdd));

                                        return updateGroupLoyaltyAbonement(
                                            this._bearer,
                                            this._clientId,
                                            abonement.id.toString(),
                                            convertFromFullDataToUpdateData(fulldata),
                                            this._fetcher,
                                            this._logger,
                                        );
                                    },
                                ],
                            })),
                        );

                    uploadDataButton.setLoading(false);
                    uploadDataButton.element.disabled    = true;
                    uploadDataButton.element.textContent = 'Завершено';
                }
            },
        });
        this._content.add(this._logger);
        this._content.add(clientEtalonIdInput);
        this._content.add(clientIdInput);
        this._content.add(uploadDataButton);
    }
}