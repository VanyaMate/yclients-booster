import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    ICompareComponent,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';
import {
    SalaryCriteriaRuleData,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    CompareHeader,
    CompareState,
} from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    salaryCriteriaRuleUseDiscountTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleUseDiscountTransform.ts';
import {
    salaryCriteriaRuleUseNetCostTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleUseNetCostTransform.ts';
import {
    salaryCriteriaRuleIndividualTypeTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleIndividualTypeTransform.ts';
import {
    salaryCriteriaRuleTargetTypeTransform,
} from '@/methods/salary_criteria/transform/salaryCriteriaRuleTargetTypeTransform.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceCategoriesCompare,
} from '@/widget/settings/service/SettingsServiceCategoriesCompare/SettingsServiceCategoriesCompare.ts';
import {
    CompareProcess,
} from '@/entity/compare/CompareProcess/CompareProcess.ts';
import {
    CompareStateIconType,
} from '@/entity/compare/CompareStateIcon/CompareStateIcon.ts';
import { Details } from '@/shared/box/Details/Details.ts';


export type CompareSalaryCriteriaRulesProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        index: number,
        ruleFrom: SalaryCriteriaRuleData;
        ruleTo?: SalaryCriteriaRuleData;
        copyData: SettingsServiceCopyData;
        existedData: SettingsServiceCopyData;
    };

export class CompareSalaryCriteriaRules extends Component<HTMLDivElement> implements ICompareComponent<HTMLDivElement> {
    private readonly _ruleFrom: SalaryCriteriaRuleData;
    private readonly _index: number;
    private readonly _copyData: SettingsServiceCopyData;
    private readonly _existedData: SettingsServiceCopyData;
    private _compareProcess: CompareProcess | null               = null;
    private _compareItems: Array<ICompareComponent<HTMLElement>> = [];

    constructor (props: CompareSalaryCriteriaRulesProps) {
        const {
                  ruleFrom,
                  ruleTo,
                  index,
                  copyData,
                  existedData,
                  ...other
              } = props;
        super('div', other);
        this._index       = index;
        this._ruleFrom    = ruleFrom;
        this._copyData    = copyData;
        this._existedData = existedData;
        this.renderWithNewRule(ruleTo);
    }

    renderWithNewRule (rule?: SalaryCriteriaRuleData) {
        if (this._compareProcess) {
            this._compareProcess.remove();
        }

        const useDiscount    = new CompareRow({
            valueFrom: salaryCriteriaRuleUseDiscountTransform(this._ruleFrom.useDiscount)!,
            valueTo  : salaryCriteriaRuleUseDiscountTransform(rule?.useDiscount),
            label    : 'С учетом скидки',
        });
        const useNetCost     = new CompareRow({
            valueFrom: salaryCriteriaRuleUseNetCostTransform(this._ruleFrom.useNetCost)!,
            valueTo  : salaryCriteriaRuleUseNetCostTransform(rule?.useNetCost),
            label    : 'Тип',
        });
        const individualType = new CompareRow({
            valueFrom: salaryCriteriaRuleIndividualTypeTransform(this._ruleFrom.individualType)!,
            valueTo  : salaryCriteriaRuleIndividualTypeTransform(rule?.individualType)!,
            label    : 'Для кого',
        });
        const targetType     = new CompareRow({
            valueFrom: salaryCriteriaRuleTargetTypeTransform(this._ruleFrom.targetType)!,
            valueTo  : salaryCriteriaRuleTargetTypeTransform(rule?.targetType),
            label    : 'За что',
        });
        const amount         = new CompareRow({
            valueFrom: this._ruleFrom.amount,
            valueTo  : rule?.amount,
            label    : 'Превышает',
        });

        this._compareItems = [];
        this._compareItems.push(useNetCost);
        this._compareItems.push(individualType);
        this._compareItems.push(targetType);
        this._compareItems.push(amount);
        this._compareItems.push(useDiscount);

        const header = new CompareHeader({
            titleFrom : `Правило #${ this._index + 1 }`,
            titleTo   : rule ? `Правило #${ this._index + 1 }` : null,
            forceState: this.getValid() ? CompareState.VALID
                                        : CompareState.WARNING,
            label     : 'Правило',
        });

        // copy categories
        const categories = this._ruleFrom.context.services?.categories.map((category) => {
            const copyCategory = this._copyData.tree.find(({ id }) => id.toString() === category.categoryId.toString())!;

            return new SettingsServiceCategoriesCompare({
                dataFrom        : copyCategory,
                dataTo          : this._existedData.tree.find(({ title }) => title === copyCategory.title),
                settingsCopyData: this._existedData,
            });
        });

        // copy items


        this._compareProcess = new CompareProcess({
            init   : this.getValid() ? CompareStateIconType.SUCCESS
                                     : CompareStateIconType.IDLE,
            content: new Details({
                header : header,
                details: new Col({
                    rows: [
                        useNetCost,
                        individualType,
                        targetType,
                        amount,
                        useDiscount,
                        new Col({
                            rows: categories ?? [],
                        }),
                    ],
                }),
            }),
        });

        this._compareProcess.insert(this.element, 'beforeend');
    }

    getValid (): boolean {
        return this._compareItems.every((row) => row.getValid());
    }
}