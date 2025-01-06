import {
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SalaryCriteriaFullData,
    SalaryCriteriaListDataForCopy,
} from '@/action/salary_criteria/types/salary-criteria.types.ts';
import {
    CompareComponent,
} from '@/entity/compare/CompareComponent/CompareComponent.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import { CompareBox } from '@/entity/compare/CompareBox/CompareBox.ts';
import {
    CompareSelectValue,
} from '@/entity/compare/CompareValue/CompareSelectValue/CompareSelectValue.ts';
import {
    CompareTextValue,
} from '@/entity/compare/CompareValue/CompareTextValue/CompareTextValue.ts';
import { Converter } from '@/converter/Converter.ts';
import {
    SettingsServiceCopyData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SalaryCriteriaRuleCompareValue,
} from '@/widget/salary_criteria/SalaryCriteriaRuleCompareValue/SalaryCriteriaRuleCompareValue.ts';
import {
    SettingsServiceCategoryCompareComponent,
} from '@/widget/settings/service/SettingsServiceCategoryCompareComponent/SettingsServiceCategoryCompareComponent.ts';


export type SalaryCriteriaCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetCriteria: SalaryCriteriaFullData;
        targetSettingsData: SettingsServiceCopyData;
        clientCopyData: SalaryCriteriaListDataForCopy;
        clientId: string;
        bearer: string;
    };

export class SalaryCriteriaCompareComponent extends CompareComponent<SalaryCriteriaFullData> {
    private readonly _targetCriteria: SalaryCriteriaFullData;
    private readonly _targetSettingsData: SettingsServiceCopyData;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private _clientCriteria?: SalaryCriteriaFullData;

    constructor (props: SalaryCriteriaCompareComponentProps) {
        const {
                  targetCriteria,
                  clientCopyData,
                  clientId,
                  bearer,
                  targetSettingsData,
                  ...other
              } = props;
        super(other);

        this._targetCriteria     = { ...targetCriteria };
        this._targetSettingsData = targetSettingsData;
        this._clientCopyData     = clientCopyData;
        this._clientId           = clientId;
        this._bearer             = bearer;
        this._clientCriteria     = this._clientCopyData.criteriaList.find((criteria) => criteria.title === this._targetCriteria.title);

        this._render();
    }

    protected async _action (): Promise<SalaryCriteriaFullData | null> {
        return null;
    }

    protected _render (): void {
        this.element.innerHTML = ``;

        this._compareRows = [
            new CompareBox({
                title     : 'Информация',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Id',
                        targetValue: new CompareTextValue({
                            value: this._targetCriteria.id,
                        }),
                        clientValue: new CompareTextValue({
                            value: this._clientCriteria?.id,
                        }),
                        validate   : false,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Основные настройки',
                level     : 2,
                components: [
                    new CompareRow({
                        label      : 'Период',
                        targetValue: new CompareSelectValue({
                            defaultValue    : 0,
                            defaultLabel    : '',
                            showDefaultLabel: false,
                            showValue       : false,
                            list            : [
                                {
                                    value   : 0,
                                    label   : Converter.period(0),
                                    selected: Number(this._targetCriteria.period) === 0,
                                },
                                {
                                    value   : 1,
                                    label   : Converter.period(1),
                                    selected: Number(this._targetCriteria.period) === 1,
                                },
                            ],
                        }),
                        clientValue: new CompareTextValue({
                            value: Number(this._clientCriteria?.period),
                            label: Converter.period(Number(this._clientCriteria?.period)),
                        }),
                        parent     : this,
                    }),
                ],
            }),
            new CompareBox({
                title     : 'Условия',
                level     : 2,
                components: this._targetCriteria.rules?.map((rule, index) => (
                    new CompareRow({
                        label      : `Правило ${ index + 1 }`,
                        targetValue: new SalaryCriteriaRuleCompareValue({
                            value   : rule,
                            editable: true,
                        }),
                        clientValue: new SalaryCriteriaRuleCompareValue({
                            value   : this._clientCriteria?.rules[index],
                            editable: false,
                        }),
                    })
                )),
            }),
        ];

        const categoriesIds = this._targetCriteria.rules
            .reduce((acc, rule) => {
                rule.context.services?.categories.forEach((category) => acc.add(category.categoryId.toString()));
                return acc;
            }, new Set<string>());

        this._compareChildren = [
            new CompareBox({
                title     : 'Категории услуг',
                level     : 3,
                components: [ ...categoriesIds ].map((categoryId) => (
                    new SettingsServiceCategoryCompareComponent({
                        targetCategory : this._targetSettingsData.tree.find((category) => category.id.toString() === categoryId.toString())!,
                        targetResources: this._targetSettingsData.resources,
                        clientId       : this._clientId,
                        bearer         : this._bearer,
                        clientData     : this._clientCopyData.settingsCopyData,
                    })
                )),
            }),
            new CompareBox({
                title     : 'Услуги',
                level     : 3,
                components: [],
            }),
        ];

        this._header = new CompareHeader({
            label           : 'Критерий расчета ЗП',
            targetHeaderData: this._targetCriteria.title,
            clientHeaderData: this._clientCriteria?.title,
            variants        : this._clientCopyData.criteriaList.map((criteria) => ({
                label   : criteria.title,
                value   : criteria.id,
                selected: criteria.id === this._clientCriteria?.id,
            })),
            onVariantChange : (variant) => {
                this._clientCriteria = this._clientCopyData.criteriaList.find((category) => category.id.toString() === variant.value);
                this._render();
                this._revalidate(this._clientCriteria);
                this._parent?.revalidateWithParents();
            },
            rows            : [
                ...this._compareRows,
                ...this._compareChildren,
            ],
            parent          : this,
        });

        this._revalidate(this._clientCriteria);
        this._parent?.revalidateWithParents();
        this._header.insert(this.element, 'afterbegin');
    }
}