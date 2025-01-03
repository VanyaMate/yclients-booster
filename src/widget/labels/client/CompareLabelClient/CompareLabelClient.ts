import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IPromisableComponent,
    PromiseCallback,
} from '@/shared/component/IPromisableComponent.interface.ts';
import {
    LabelClientType,
} from '@/action/labels/client/types/labelClientType.ts';
import { Details, DetailsType } from '@/shared/box/Details/Details.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    createLabelClientRequestAction,
} from '@/action/labels/client/request-action/createLabelsClient/createLabelClient.request-action.ts';
import {
    updateLabelClientRequestAction,
} from '@/action/labels/client/request-action/updateLabelClient/updateLabelClient.request-action.ts';
import {
    ICompareComponent,
} from '@/entity/compare/lagacy/CompareRow.legacy.interface.ts';
import {
    CompareProcessLegacy,
} from '@/entity/compare/lagacy/CompareProcess.lagacy.ts';
import { CompareRowLegacy } from '@/entity/compare/lagacy/CompareRow.legacy.ts';
import {
    CompareHeaderLegacy,
} from '@/entity/compare/lagacy/CompareHeader.legacy.ts';
import {
    CompareStateIconTypeLegacy,
} from '@/entity/compare/lagacy/CompareStateIcon.legacy.ts';


export type CompareLabelClientProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        copyLabel: LabelClientType;
        compareList: Array<LabelClientType>;
        targetClientId: string;
        targetLabel?: LabelClientType;
    };

export class CompareLabelClient extends Component<HTMLDivElement> implements IPromisableComponent<HTMLDivElement>,
                                                                             ICompareComponent<HTMLDivElement> {
    private _copyLabel: LabelClientType;
    private _compareList: Array<LabelClientType>;
    private _targetClientId: string;
    private _targetLabel?: LabelClientType;
    private _compareProcess: CompareProcessLegacy | null                = null;
    private _currentCompareItems: Array<ICompareComponent<HTMLElement>> = [];

    constructor (props: CompareLabelClientProps) {
        const {
                  copyLabel,
                  compareList,
                  targetLabel,
                  targetClientId,
                  ...other
              } = props;
        super('div', other);

        this._copyLabel      = copyLabel;
        this._compareList    = compareList;
        this._targetClientId = targetClientId;
        this._targetLabel    = targetLabel;

        this._render(this._targetLabel);
    }

    private _render (targetLabel?: LabelClientType) {
        if (this._compareProcess) {
            this._compareProcess.remove();
        }

        const rows = [
            new CompareRowLegacy({
                label    : 'Цвет',
                valueFrom: this._copyLabel.color,
                valueTo  : targetLabel?.color,
            }),
            new CompareRowLegacy({
                label    : 'Иконка',
                valueFrom: this._copyLabel.icon,
                valueTo  : targetLabel?.icon,
            }),
        ];

        const header = new CompareHeaderLegacy({
            label          : 'Категория',
            titleFrom      : this._copyLabel.title,
            titleTo        : targetLabel?.title,
            variants       : this._compareList.map((label) => ({
                id   : label.id,
                title: label.title,
            })),
            idTo           : targetLabel?.id,
            onVariantChange: (id: string) => {
                this._targetLabel = this._compareList.find((label) => label.id === id);
                this._render(this._targetLabel);
            },
        });

        this._currentCompareItems = [ ...rows, header ];

        this._compareProcess = new CompareProcessLegacy({
            init   : this.getValid() ? CompareStateIconTypeLegacy.SUCCESS
                                     : CompareStateIconTypeLegacy.IDLE,
            content: new Details({
                header,
                details: new Col({ rows }),
                type   : DetailsType.SECOND,
            }),
        });

        this._compareProcess.insert(this.element, 'afterbegin');
    }

    getValid (): boolean {
        return this._currentCompareItems.every((compareItem) => compareItem.getValid());
    }

    getPromises (): Array<PromiseCallback> {
        if (this.getValid()) {
            return [];
        } else if (this._targetLabel) {
            const targetId = this._targetLabel.id;
            return [
                async () => {
                    this._compareProcess?.setState(CompareStateIconTypeLegacy.PROCESS);
                    updateLabelClientRequestAction(this._targetClientId, targetId, this._copyLabel)
                        .then(() => this._compareProcess?.setState(CompareStateIconTypeLegacy.SUCCESS))
                        .catch(() => this._compareProcess?.setState(CompareStateIconTypeLegacy.ERROR));
                },
            ];
        } else {
            return [
                async () => {
                    this._compareProcess?.setState(CompareStateIconTypeLegacy.PROCESS);
                    createLabelClientRequestAction(this._targetClientId, this._copyLabel)
                        .then(() => this._compareProcess?.setState(CompareStateIconTypeLegacy.SUCCESS))
                        .catch(() => this._compareProcess?.setState(CompareStateIconTypeLegacy.ERROR));
                },
            ];
        }
    }
}