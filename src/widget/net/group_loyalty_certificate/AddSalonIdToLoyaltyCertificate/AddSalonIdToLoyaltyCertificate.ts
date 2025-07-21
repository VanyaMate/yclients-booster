import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    getGroupLoyaltyCertificate,
} from '@/action/net/group-loyalty-certificate/request-action/getGroupLoyaltyCertificate.ts';
import {
    GroupLoyaltyCertificateData,
} from '@/action/net/group-loyalty-certificate/types/group-loyalty-certificate.types.ts';
import {
    updateGroupLoyaltyCertificate,
} from '@/action/net/group-loyalty-certificate/request-action/updateGroupLoyaltyCertificate.ts';
import {
    getGroupLoyaltyCertificatesShortDataByApi,
} from '@/action/net/group-loyalty-certificate/request-action/getGroupLoyaltyCertificatesShortDataByApi.ts';


export type AddSalonIdToLoyaltyCertificateProps =
    {
        bearer: string;
        clientId: string;
    }
    & ComponentPropsOptional<HTMLDivElement>;

export class AddSalonIdToLoyaltyCertificate extends Component<HTMLDivElement> {
    private readonly _logger: Logger;
    private readonly _fetcher: IFetcher;
    private readonly _content: Col;
    private readonly _clientId: string;
    private readonly _bearer: string;

    constructor (props: AddSalonIdToLoyaltyCertificateProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);

        this._content  = new Col({ rows: [] });
        this._logger   = new Logger({});
        this._fetcher  = new MemoFetch();
        this._clientId = clientId;
        this._bearer   = bearer;
        this._content.insert(this.element, 'afterbegin');
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const clientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала который нужно добавить',
        });

        const uploadDataButton = new Button({
            textContent: 'Добавить',
            styleType  : ButtonStyleType.PRIMARY,
            onclick    : async () => {
                const clientIdToAdd = clientIdInput.getValue();

                if (clientIdToAdd) {
                    uploadDataButton.setLoading(true);

                    const certificates = await getGroupLoyaltyCertificatesShortDataByApi(this._bearer, this._clientId, this._logger);
                    await new PromiseSplitter(3, 1)
                        .exec(
                            certificates.map((certificate) => ({
                                chain: [
                                    () => getGroupLoyaltyCertificate(this._clientId, certificate.id, this._logger),
                                    async (fulldata: GroupLoyaltyCertificateData) => {
                                        const salonIds = fulldata.salon_ids.split(',');
                                        if (salonIds.includes(clientIdToAdd)) {
                                            return fulldata;
                                        }

                                        fulldata.salon_ids = salonIds.concat(clientIdToAdd).join(',');

                                        return updateGroupLoyaltyCertificate(
                                            this._clientId,
                                            certificate.id,
                                            fulldata,
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
        this._content.add(clientIdInput);
        this._content.add(uploadDataButton);
    }
}