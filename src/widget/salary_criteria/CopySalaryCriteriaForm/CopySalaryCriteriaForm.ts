import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import css from './CopySalaryCriteriaForm.module.css';
import { Col } from '@/shared/box/Col/Col.ts';
import { TextInput } from '@/shared/input/TextInput/TextInput.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import {
    getSalaryCriteriaListDataForCopyRequestAction,
} from '@/action/salary_criteria/request-action/getSalaryCriteriaListDataForCopy/getSalaryCriteriaListDataForCopy.request-action.ts';
import {
    CompareSalaryCriteria,
} from '@/entity/salary_criteria/CompareSalaryCriteria/CompareSalaryCriteria.ts';


export type CopySalaryCriteriaFormProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    }

export class CopySalaryCriteriaForm extends Component<HTMLDivElement> {
    private readonly _clientId: string = '';
    private readonly _bearer: string   = '';
    private _logger: Logger            = new Logger({
        className: css.logger,
    });

    constructor (props: CopySalaryCriteriaFormProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;
        this.element.classList.add(css.container);

        this._logger.insert(this.element, 'afterbegin');

        const control = new Col({
            rows: [],
        });

        const copyToInput = new TextInput({
            type       : 'text',
            placeholder: 'Введите ID филиала для сравнения',
        });
        const checkButton = new Button({
            innerHTML: 'Сравнить',
            onclick  : async () => {
                const copyToId = copyToInput.getValue();

                if (copyToId) {
                    control.remove();
                    const copyFromData = await this._getCriteriaListData(this._clientId);
                    const copyToData   = await this._getCriteriaListData(copyToId, !!copyFromData.settingsCopyData.tree.length);

                    this._renderSalaryCriteriaCompare(copyFromData, copyToData);

                    console.log('Compare:', copyFromData, 'with', copyToData);
                }
            },
        });

        control.add(copyToInput);
        control.add(checkButton);
        control.insert(this.element, 'beforeend');
    }

    private _renderSalaryCriteriaCompare (dataFrom: SalaryCriteriaListDataForCopy, dataTo: SalaryCriteriaListDataForCopy) {
        new Col({
            rows: dataFrom.criteriaList.map((criteria) => {
                const compareCriteria = new CompareSalaryCriteria({
                    dataFrom   : criteria,
                    dataTo     : dataTo.criteriaList.find((_criteria) => _criteria.title === criteria.title),
                    dataToList : dataTo.criteriaList,
                    copyData   : dataFrom.settingsCopyData,
                    existedData: dataTo.settingsCopyData,
                    onChange   : (changeId: string) => {
                        compareCriteria.renderWithNewDataTo(dataTo.criteriaList.find(({ id }) => id === changeId));
                    },
                });

                return compareCriteria;
            }),
        })
            .insert(this.element, 'beforeend');
    }

    private async _getCriteriaListData (clientId: string, forceUploadServices: boolean = false): Promise<SalaryCriteriaListDataForCopy> {
        return getSalaryCriteriaListDataForCopyRequestAction(this._bearer, clientId, forceUploadServices, PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY, this._logger);
    }
}