import {
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SalaryCriteriaFullData,
    SalaryCriteriaListDataForCopy, SalaryCriteriaRuleData,
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
    ICompareEntity,
} from '@/entity/compare/Compare.types.ts';
import {
    SALARY_CRITERIA_HEADER_TYPE,
} from '@/widget/salary_criteria/salary-criteria.header-type.ts';
import { ILogger } from '@/action/_logger/Logger.interface.ts';
import { IFetcher } from '@/service/Fetcher/Fetcher.interface.ts';
import {
    SalaryCriteriaRuleCompareComponent,
} from '@/widget/salary_criteria/SalaryCriteriaRuleCompareComponent/SalaryCriteriaRuleCompareComponent.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';


/**
 * Проблема в том, что сейчас все сервисы и услуги "лежат" вместе и не
 * привязаны к конкретному условию, а должны быть. Из-за чего не понятно как
 * (будет сложно сделать правильно (если вообще возможно)) сопоставлять
 * правила и услуги/товары.
 *
 * То есть нужно создать еще один компонент для работы именно в отдельными
 * условиями(правилами) и будут возвращать готовые данные для правила
 */

export type SalaryCriteriaTitlesTree = {
    title: string;
    items: Array<SalaryCriteriaTitlesTree>;
}

export type SalaryCriteriaChildrenItem<Type> = {
    component: ICompareEntity<Type>;
    titlesTree: SalaryCriteriaTitlesTree;
}


export type SalaryCriteriaCompareComponentProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        targetCriteria: SalaryCriteriaFullData;
        targetCopyData: SalaryCriteriaListDataForCopy;
        clientCopyData: SalaryCriteriaListDataForCopy;
        clientId: string;
        bearer: string;
        logger?: ILogger;
        fetcher?: IFetcher;
    };

export class SalaryCriteriaCompareComponent extends CompareComponent<SalaryCriteriaFullData> {
    private readonly _targetCriteria: SalaryCriteriaFullData;
    private readonly _targetCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientCopyData: SalaryCriteriaListDataForCopy;
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _logger?: ILogger;
    private readonly _fetcher?: IFetcher;
    private _clientCriteria?: SalaryCriteriaFullData;
    private _rules: Array<CompareComponent<SalaryCriteriaRuleData>> = [];

    constructor (props: SalaryCriteriaCompareComponentProps) {
        const {
                  targetCriteria,
                  clientCopyData,
                  clientId,
                  bearer,
                  targetCopyData,
                  logger,
                  fetcher,
                  ...other
              } = props;
        super(other);

        this._targetCriteria = { ...targetCriteria };
        this._targetCopyData = targetCopyData;
        this._clientCopyData = clientCopyData;
        this._clientId       = clientId;
        this._bearer         = bearer;
        this._logger         = logger;
        this._fetcher        = fetcher;
        this._clientCriteria = this._clientCopyData.criteriaList.find((criteria) => criteria.title === this._targetCriteria.title);

        this._render();
    }

    public getChildren (): Array<ICompareEntity<SalaryCriteriaRuleData>> {
        return this._rules;
    }

    protected async _action (): Promise<SalaryCriteriaFullData | null> {
        if (this._clientCriteria) {
            if (this._itemIsValid()) {
                if (this._childrenIsValid()) {
                    // return item
                    console.log('NOTHING');
                    return this._clientCriteria;
                } else {
                    // action children
                    const splitter = new PromiseSplitter(5, 1);
                    const rules    = await splitter.exec<SalaryCriteriaRuleData>(this._rules.map((rule) => ({ chain: [ rule.getAction() ] })));
                    console.log(rules);
                    return this._clientCriteria;
                    // return item
                }
            } else {
                if (this._childrenIsValid()) {
                    // update item
                    // return item
                } else {
                    // update item
                    // action children
                    // return item
                }
            }

            // TEMP: Чтобы не было ошибки типизации
            return null;
        } else {
            if (!this._isNoCreateNew()) {
                // create item

                if (!this._childrenIsValid()) {
                    // action children
                }

                // return item
            }

            return null;
        }
    }

    protected _render (): void {
        this._beforeRender();

        console.log('this._targetCriteria', this._targetCriteria);

        this._compareChildren = [];
        this._rules           = [];
        this._compareRows     = [
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
        ];
        this._compareChildren = [
            new CompareBox({
                title     : 'Условия',
                level     : 2,
                components: this._rules = this._targetCriteria.rules?.map((rule, index) => (
                    new SalaryCriteriaRuleCompareComponent({
                        bearer        : this._bearer,
                        clientId      : this._clientId,
                        ruleIndex     : index,
                        targetRule    : rule,
                        clientRule    : this._clientCriteria?.rules[index],
                        targetCopyData: this._targetCopyData,
                        clientCopyData: this._clientCopyData,
                        logger        : this._logger,
                        fetcher       : this._fetcher,
                        parent        : this,
                    })
                )),
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
            },
            onRename        : (title: string) => {
                this._targetCriteria.title = title;
            },
            rows            : [ ...this._compareRows, ...this._compareChildren ],
            parent          : this,
            type            : SALARY_CRITERIA_HEADER_TYPE,
            compareType     : this._compareType,
        });

        this._beforeEndRender(this._clientCriteria);
    }
}