import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    ResourcesCompareComponent,
} from '@/widget/resources/ResourcesCompareComponent/ResourcesCompareComponent.ts';
import {
    uploadResourcesWithInstancesRequestAction,
} from '@/action/resources/request-action/uploadResourcesWithInstances/upload-resources-with-instances-request.action.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { MemoFetch } from '@/service/Fetcher/implementations/MemoFetch.ts';


export type ResourceCopyFormComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
    };

export class ResourceCopyFormComponent extends Component<HTMLDivElement> {
    private readonly _clientId: string;

    constructor (props: ResourceCopyFormComponentProps) {
        const { clientId, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._renderInitialForm();
    }

    private _renderInitialForm () {
        const targetClientIdInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID клиента',
        });

        const initCompareButton = new Button({
            styleType  : ButtonStyleType.DEFAULT,
            textContent: 'Сравнить',
            onclick    : () => {
                initialForm.remove();
                this._renderCompareForm(targetClientIdInput.getValue());
            },
        });

        const initialForm = new Col({
            rows: [ targetClientIdInput, initCompareButton ],
        });

        initialForm.insert(this.element, 'afterbegin');
    }

    private async _renderCompareForm (targetClientID: string) {
        const actionButton = new Button({
            styleType  : ButtonStyleType.PRIMARY,
            textContent: 'Преобразовать',
            onclick    : async () => {
                actionButton.setLoading(true);
                await compareForm.getAction()();
                actionButton.setLoading(false);
                actionButton.element.disabled = true;
            },
        });

        const logger     = new Logger({});
        const actionForm = new Col({
            rows: [
                logger,
            ],
        });

        actionForm.insert(this.element, 'afterbegin');

        const targetData = await uploadResourcesWithInstancesRequestAction(targetClientID, 5, 1, logger);
        const clientData = await uploadResourcesWithInstancesRequestAction(this._clientId, 5, 1, logger);

        const compareForm = new ResourcesCompareComponent({
            clientId       : this._clientId,
            targetData     : targetData,
            clientData     : clientData,
            logger         : logger,
            fetcher        : new MemoFetch(),
            promiseSplitter: {
                limit: 5,
                retry: 1,
            },
        });

        actionForm.add(compareForm);
        actionForm.add(actionButton);
    }
}