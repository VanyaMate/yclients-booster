import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import { Button, ButtonStyleType } from '@/shared/buttons/Button/Button.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import { RequestSplitter } from '@/service/RequestSplitter/RequestSplitter.ts';
import css from './CopySalaryParamsListForm.module.css';


export type CopySalaryParamsListFormProps = ComponentPropsOptional<HTMLDivElement>;

export type SalaryItem = {
    id: string;
    title: string;
}

export type SalaryCreateData = {
    title: string;
    service_value: string;
    service_type: string;
    group_id: string;
    service_changed_value: string;
    service_changed_value_type: string;
    'activity[min][amount]': string;
    'activity[min][type]': string;
    'activity[perform][amount]': string;
    'activity[perform][type]': string;
    'activity[every_client][enabled]': string;
    'activity[every_client][min_limit][amount]': string;
    record_created_fix: string;
    record_created_each_service_value: string;
    record_created_each_service_type: string;
    record_created_service_changed_value: string;
    record_created_service_changed_value_type: string;
    record_closed_each_service_value: string;
    record_closed_each_service_type: string;
    record_closed_service_changed_value: string;
    record_closed_service_changed_value_type: string;
    product_value: string;
    product_type: string;
    good_changed_value: string;
    good_changed_value_type: string;
    loyalty_discount_value: string;
    loyalty_discount_type: string;
    loyalty_program_option_value: string;
    loyalty_program_option_value_type: string;
    fix_for_period: string;
    period_name: string;
    min_salary_fix: string;
    min_salary_period_type: string;
    percent_retro_bonus: string;
    retro_bonus_use_net_cost: string;
    retro_bonus_targets_type: string;
    use_discount: string;
    use_loyalty_discount: string;
    use_loyalty_bonus: string;
    use_loyalty_certificate: string;
    use_loyalty_abonement: string;
    use_net_cost_service: string;
    use_net_cost_good: string;
    calc_cost_with_discount_after_minus_net_cost: string;
}

export class CopySalaryParamsListForm extends Component<HTMLDivElement> {
    private _input: HTMLInputElement;
    private _logger: Logger;
    private _requestSplitterForGetter: RequestSplitter<SalaryItem>;
    private _requestSplitterForCreator: RequestSplitter<SalaryCreateData>;
    private _copiesOfSalaryParams: Array<SalaryCreateData> = [];
    private _domParser: DOMParser;
    private _clientId: string                              = '';

    constructor (props: CopySalaryParamsListFormProps) {
        super('div', props);
        this.element.innerHTML = `
            <div class="${ css.left }">
                <input type="text" placeholder="ID клиента" class="client-id"/>
            </div>
        `;
        this.element.classList.add(css.container);
        new Button({
            styleType: ButtonStyleType.PRIMARY,
            onclick  : this.onClickHandler.bind(this),
            innerHTML: 'Копировать',
        }).insert(this.element.querySelector(`.${ css.left }`)!, 'beforeend');
        this._input = this.element.querySelector('input')!;

        // Logger
        this._logger = new Logger({});
        this._logger.insert(this.element, 'beforeend');

        // Parser
        this._domParser = new DOMParser();

        // RequestSplitter for creating data
        this._requestSplitterForCreator = new RequestSplitter<SalaryCreateData>(
            () => '',
            (salaryItem: SalaryCreateData) => this._logger.log(`правила расчета для "${ salaryItem.title }" создаются...`),
            (salaryItem: SalaryCreateData) => this._logger.success(`правила расчета для  "${ salaryItem.title }" созданы.`),
            (salaryItem: SalaryCreateData, retry: number) => this._logger.log(`правила расчета для  "${ salaryItem.title }" не созданы. Попытка ${ retry }`),
            (salaryItem: SalaryCreateData, error: unknown) => this._logger.error(`правила расчета для  "${ salaryItem.title }" не созданы. Ошибка ${ error }`),
            (success, error) => {
                console.log('Success', success, 'Error', error);
                this._logger.log('************');
                this._logger.log('************');
                this._logger.log('************');
                this._logger.success(`завершено ${ success.length }`);

                if (error.length) {
                    this._logger.error(`завершено с ошибкой ${ error.length }`);
                }
            },
            5,
            1,
            false,
        );

        // RequestSplitter for getting data
        this._requestSplitterForGetter = new RequestSplitter<SalaryItem>(
            (data: unknown) => {
                if (typeof data === 'string') {
                    const dom  = this._domParser.parseFromString(data, 'text/html');
                    const form = dom.querySelector<HTMLFormElement>('#salary_param_form');

                    if (form) {
                        this._copiesOfSalaryParams.push(this.parseSalaryDataFromDom(form));
                        return '';
                    }

                    return 'не получилось получить данные';
                }

                return 'неизвестная ошибка';
            },
            (salaryItem: SalaryItem) => this._logger.log(`правила расчета для "${ salaryItem.title }" копируются...`),
            (salaryItem: SalaryItem) => this._logger.success(`правила расчета для  "${ salaryItem.title }" получены.`),
            (salaryItem: SalaryItem, retry: number) => this._logger.log(`правила расчета для  "${ salaryItem.title }" не получены. Попытка ${ retry }`),
            (salaryItem: SalaryItem, error: unknown) => this._logger.error(`правила расчета для  "${ salaryItem.title }" не получены. Ошибка ${ error }`),
            (success, error) => {
                console.log('Success', success, 'Error', error);
                console.log(this._copiesOfSalaryParams);
                this._logger.log('************');
                this._logger.log('************');
                this._logger.log('************');

                this._logger.success(`завершено ${ success.length }`);

                if (error.length) {
                    this._logger.error(`завершено с ошибкой ${ error.length }`);
                }

                this._requestSplitterForCreator.requests(
                    this._copiesOfSalaryParams.map((copy) => {
                        const formData = new FormData();

                        Object.entries(copy).forEach(([ key, value ]: [ string, string ]) => formData.append(key, value));

                        return {
                            data   : copy,
                            url    : this.getSalaryCreateRequestUrl(this._clientId),
                            options: {
                                method: 'POST',
                                body  : formData,
                            },
                        };
                    }),
                );
            },
            5,
            1,
            false,
        );
    }

    private onClickHandler () {
        const clientToCopyId: string = this._input.value.trim();
        if (clientToCopyId) {
            this._clientId = clientToCopyId;
            this.copyToClient();
        }
    }

    private copyToClient () {
        const currentClientId: string = this.getClientId();

        if (currentClientId) {
            this._requestSplitterForGetter.requests(
                this.getSalaryParamsList().map(
                    (salaryParam) => ({
                        data   : salaryParam,
                        url    : this.getSalaryGetterRequestUrl(currentClientId, salaryParam.id),
                        options: {
                            method: 'GET',
                        },
                    }),
                ),
            );
        }
    }

    private getClientId (): string {
        return location.pathname.split('/')[3];
    }

    private getSalaryParamsList (): Array<SalaryItem> {
        const items = [ ...document.querySelectorAll<HTMLAnchorElement>(`.project-list tbody .project-title a`) ];

        return items.map((item) => ({
            id   : item.pathname.split('/')[4],
            title: item.textContent!.trim(),
        }));
    }

    private getSalaryGetterRequestUrl (clientId: string, salaryId: string) {
        return `https://yclients.com/salary_params/edit/${ clientId }/${ salaryId }/`;
    }

    private getSalaryCreateRequestUrl (clientId: string): string {
        return `https://yclients.com/salary_params/save/${ clientId }/0/`;
    }

    private parseSalaryDataFromDom (form: HTMLFormElement): SalaryCreateData {
        return {
            title                                       : form.querySelector<HTMLInputElement>('input[name="title"]')!?.value,
            service_value                               : form.querySelector<HTMLInputElement>('input[name="service_value"]')!?.value,
            service_type                                : form.querySelector<HTMLInputElement>('select[name="service_type"]')!?.value,
            group_id                                    : form.querySelector<HTMLInputElement>('select[name="group_id"]')!?.value,
            service_changed_value                       : form.querySelector<HTMLInputElement>('input[name="service_changed_value"]')!?.value,
            service_changed_value_type                  : form.querySelector<HTMLInputElement>('select[name="service_changed_value_type"]')!?.value,
            'activity[min][amount]'                     : form.querySelector<HTMLInputElement>('input[name="activity[min][amount]"]')!?.value,
            'activity[min][type]'                       : form.querySelector<HTMLInputElement>('select[name="activity[min][type]"]')!?.value,
            'activity[perform][amount]'                 : form.querySelector<HTMLInputElement>('input[name="activity[perform][amount]"]')!?.value,
            'activity[perform][type]'                   : form.querySelector<HTMLInputElement>('select[name="activity[perform][type]"]')!?.value,
            'activity[every_client][enabled]'           : form.querySelector<HTMLInputElement>('input[name="activity[every_client][enabled]"]')!?.checked
                                                          ? 'on' : '',
            'activity[every_client][min_limit][amount]' : form.querySelector<HTMLInputElement>('input[name="activity[every_client][min_limit][amount]"]')!?.value,
            record_created_fix                          : form.querySelector<HTMLInputElement>('input[name="record_created_fix"]')!?.value,
            record_created_each_service_value           : form.querySelector<HTMLInputElement>('input[name="record_created_each_service_value"]')!?.value,
            record_created_each_service_type            : form.querySelector<HTMLInputElement>('select[name="record_created_each_service_type"]')!?.value,
            record_created_service_changed_value        : form.querySelector<HTMLInputElement>('input[name="record_created_service_changed_value"]')!?.value,
            record_created_service_changed_value_type   : form.querySelector<HTMLInputElement>('select[name="record_created_service_changed_value_type"]')!?.value,
            record_closed_each_service_value            : form.querySelector<HTMLInputElement>('input[name="record_closed_each_service_value"]')!?.value,
            record_closed_each_service_type             : form.querySelector<HTMLInputElement>('select[name="record_closed_each_service_type"]')!?.value,
            record_closed_service_changed_value         : form.querySelector<HTMLInputElement>('input[name="record_closed_service_changed_value"]')!?.value,
            record_closed_service_changed_value_type    : form.querySelector<HTMLInputElement>('select[name="record_closed_service_changed_value_type"]')!?.value,
            product_value                               : form.querySelector<HTMLInputElement>('input[name="product_value"]')!?.value,
            product_type                                : form.querySelector<HTMLInputElement>('select[name="product_type"]')!?.value,
            good_changed_value                          : form.querySelector<HTMLInputElement>('input[name="good_changed_value"]')!?.value,
            good_changed_value_type                     : form.querySelector<HTMLInputElement>('select[name="good_changed_value_type"]')!?.value,
            loyalty_discount_value                      : form.querySelector<HTMLInputElement>('input[name="loyalty_discount_value"]')!?.value,
            loyalty_discount_type                       : form.querySelector<HTMLInputElement>('select[name="loyalty_discount_type"]')!?.value,
            loyalty_program_option_value                : form.querySelector<HTMLInputElement>('input[name="loyalty_program_option_value"]')!?.value,
            loyalty_program_option_value_type           : form.querySelector<HTMLInputElement>('select[name="loyalty_program_option_value_type"]')!?.value,
            fix_for_period                              : form.querySelector<HTMLInputElement>('input[name="fix_for_period"]')!?.value,
            period_name                                 : form.querySelector<HTMLInputElement>('select[name="period_name"]')!?.value,
            min_salary_fix                              : form.querySelector<HTMLInputElement>('input[name="min_salary_fix"]')!?.value,
            min_salary_period_type                      : form.querySelector<HTMLInputElement>('select[name="min_salary_period_type"]')!?.value,
            percent_retro_bonus                         : form.querySelector<HTMLInputElement>('input[name="percent_retro_bonus"]')!?.value,
            retro_bonus_use_net_cost                    : form.querySelector<HTMLInputElement>('select[name="retro_bonus_use_net_cost"]')!?.value,
            retro_bonus_targets_type                    : form.querySelector<HTMLInputElement>('select[name="retro_bonus_targets_type"]')!?.value,
            use_discount                                : form.querySelector<HTMLInputElement>('input[name="use_discount"]')!?.checked
                                                          ? '1' : '0',
            use_loyalty_discount                        : form.querySelector<HTMLInputElement>('input[name="use_loyalty_discount"]')!?.checked
                                                          ? '1' : '0',
            use_loyalty_bonus                           : form.querySelector<HTMLInputElement>('input[name="use_loyalty_bonus"]')!?.checked
                                                          ? '1' : '0',
            use_loyalty_certificate                     : form.querySelector<HTMLInputElement>('input[name="use_loyalty_certificate"]')!?.checked
                                                          ? '1' : '0',
            use_loyalty_abonement                       : form.querySelector<HTMLInputElement>('input[name="use_loyalty_abonement"]')!?.checked
                                                          ? '1' : '0',
            use_net_cost_service                        : form.querySelector<HTMLInputElement>('input[name="use_net_cost_service"]')!?.checked
                                                          ? '1' : '0',
            use_net_cost_good                           : form.querySelector<HTMLInputElement>('input[name="use_net_cost_good"]')!?.checked
                                                          ? '1' : '0',
            calc_cost_with_discount_after_minus_net_cost: form.querySelector<HTMLInputElement>('input[name="calc_cost_with_discount_after_minus_net_cost"]')!?.value,
        };
    }
}