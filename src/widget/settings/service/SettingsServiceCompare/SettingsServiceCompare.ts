import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    IPromisableComponent,
    PromiseCallback,
} from '@/shared/component/IPromisableComponent.interface.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';
import { CompareRow } from '@/entity/compare/CompareRow/CompareRow.ts';
import {
    ICompareItem,
} from '@/entity/compare/CompareRow/CompareRow.interface.ts';
import { Details } from '@/shared/box/Details/Details.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type SettingsServiceCompareProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
    dataFrom: SettingsServiceData;
    dataTo?: SettingsServiceData | null;
    services?: Array<SettingsServiceData>;
}

export class SettingsServiceCompare extends Component<HTMLDivElement> implements IPromisableComponent<HTMLDivElement>, ICompareItem<HTMLDivElement> {
    private _dataFrom: SettingsServiceData;
    private _services: Array<SettingsServiceData> | undefined = undefined;
    private _currentDataTo: SettingsServiceData | null        = null;
    private _compareItems: Array<ICompareItem<HTMLElement>>   = [];

    constructor (props: SettingsServiceCompareProps) {
        const { dataFrom, dataTo, services, ...other } = props;
        super('div', other);

        this._dataFrom      = dataFrom;
        this._services      = services;
        this._currentDataTo = dataTo ?? null;
        this._render();
    }

    private _render () {
        this.element.innerHTML = '';
        this._compareItems     = [];

        const header = new CompareHeader({
            titleFrom : this._dataFrom.title,
            titleTo   : this._currentDataTo?.title,
            variants  : this._services?.map((service) => ({
                id   : service.id.toString(),
                title: service.title,
            })),
            idTo      : this._currentDataTo?.id.toString(),
            modalLabel: 'Выбрать сервис',
        });

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.tax_variant,
                valueTo  : this._currentDataTo?.tax_variant,
                label    : 'tax_variant',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.vat_id,
                valueTo  : this._currentDataTo?.vat_id,
                label    : 'vat_id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.print_title,
                valueTo  : this._currentDataTo?.print_title,
                label    : 'print_title',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.service_type.toString(),
                valueTo  : this._currentDataTo?.service_type.toString(),
                label    : 'service_type',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.api_service_id.toString(),
                valueTo  : this._currentDataTo?.api_service_id.toString(),
                label    : 'api_service_id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.repeat_visit_days_step,
                valueTo  : this._currentDataTo?.repeat_visit_days_step,
                label    : 'repeat_visit_days_step',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.seance_search_start.toString(),
                valueTo  : this._currentDataTo?.seance_search_start.toString(),
                label    : 'seance_search_start',
            }),
        );
        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.seance_search_finish.toString(),
                valueTo  : this._currentDataTo?.seance_search_finish.toString(),
                label    : 'seance_search_finish',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.seance_search_step.toString(),
                valueTo  : this._currentDataTo?.seance_search_step.toString(),
                label    : 'seance_search_step',
            }),
        );
        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.step.toString(),
                valueTo  : this._currentDataTo?.step.toString(),
                label    : 'step',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_need_limit_date ? 'Да' : 'Нет',
                valueTo  : this._currentDataTo?.is_need_limit_date ? 'Да'
                                                                   : 'Нет',
                label    : 'is_need_limit_date',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.date_from,
                valueTo  : this._currentDataTo?.date_from,
                label    : 'date_from',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.date_to,
                valueTo  : this._currentDataTo?.date_to,
                label    : 'date_to',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.schedule_template_type.toString(),
                valueTo  : this._currentDataTo?.schedule_template_type.toString(),
                label    : 'schedule_template_type',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.online_invoicing_status.toString(),
                valueTo  : this._currentDataTo?.online_invoicing_status.toString(),
                label    : 'online_invoicing_status',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_abonement_autopayment_enabled.toString(),
                valueTo  : this._currentDataTo?.is_abonement_autopayment_enabled.toString(),
                label    : 'is_abonement_autopayment_enabled',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.autopayment_before_visit_time.toString(),
                valueTo  : this._currentDataTo?.autopayment_before_visit_time.toString(),
                label    : 'autopayment_before_visit_time',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.abonement_restriction_value.toString(),
                valueTo  : this._currentDataTo?.abonement_restriction_value.toString(),
                label    : 'abonement_restriction_value',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_chain.toString(),
                valueTo  : this._currentDataTo?.is_chain.toString(),
                label    : 'is_chain',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_price_managed_only_in_chain.toString(),
                valueTo  : this._currentDataTo?.is_price_managed_only_in_chain.toString(),
                label    : 'is_price_managed_only_in_chain',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_comment_managed_only_in_chain.toString(),
                valueTo  : this._currentDataTo?.is_comment_managed_only_in_chain.toString(),
                label    : 'is_comment_managed_only_in_chain',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.price_prepaid_amount.toString(),
                valueTo  : this._currentDataTo?.price_prepaid_amount.toString(),
                label    : 'price_prepaid_amount',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.price_prepaid_percent.toString(),
                valueTo  : this._currentDataTo?.price_prepaid_percent.toString(),
                label    : 'price_prepaid_percent',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_composite.toString(),
                valueTo  : this._currentDataTo?.is_composite.toString(),
                label    : 'is_composite',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.id.toString(),
                valueTo  : this._currentDataTo?.id.toString(),
                label    : 'id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.salon_service_id.toString(),
                valueTo  : this._currentDataTo?.salon_service_id.toString(),
                label    : 'salon_service_id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.title.toString(),
                valueTo  : this._currentDataTo?.title.toString(),
                label    : 'title',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.category_id.toString(),
                valueTo  : this._currentDataTo?.category_id.toString(),
                label    : 'category_id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.price_min.toString(),
                valueTo  : this._currentDataTo?.price_min.toString(),
                label    : 'price_min',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.price_max.toString(),
                valueTo  : this._currentDataTo?.price_max.toString(),
                label    : 'price_max',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.discount.toString(),
                valueTo  : this._currentDataTo?.discount.toString(),
                label    : 'discount',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.comment.toString(),
                valueTo  : this._currentDataTo?.comment.toString(),
                label    : 'comment',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.weight.toString(),
                valueTo  : this._currentDataTo?.weight.toString(),
                label    : 'weight',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.active.toString(),
                valueTo  : this._currentDataTo?.active.toString(),
                label    : 'active',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.api_id.toString(),
                valueTo  : this._currentDataTo?.api_id.toString(),
                label    : 'api_id',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.prepaid.toString(),
                valueTo  : this._currentDataTo?.prepaid.toString(),
                label    : 'prepaid',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_multi.toString(),
                valueTo  : this._currentDataTo?.is_multi.toString(),
                label    : 'is_multi',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.capacity.toString(),
                valueTo  : this._currentDataTo?.capacity.toString(),
                label    : 'capacity',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.image_group.toString(),
                valueTo  : this._currentDataTo?.image_group.toString(),
                label    : 'image_group',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.staff.toString(),
                valueTo  : this._currentDataTo?.staff.toString(),
                label    : 'staff',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.dates.toString(),
                valueTo  : this._currentDataTo?.dates.toString(),
                label    : 'dates',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.duration.toString(),
                valueTo  : this._currentDataTo?.duration.toString(),
                label    : 'duration',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.resources.toString(),
                valueTo  : this._currentDataTo?.resources.toString(),
                label    : 'resources',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.is_online.toString(),
                valueTo  : this._currentDataTo?.is_online.toString(),
                label    : 'is_online',
            }),
        );

        this._compareItems.push(
            new CompareRow({
                valueFrom: this._dataFrom.composite_details.toString(),
                valueTo  : this._currentDataTo?.composite_details.toString(),
                label    : 'composite_details',
            }),
        );

        new Details({
            header : header,
            details: new Col({
                rows: this._compareItems,
            }),
        }).insert(this.element, 'beforeend');
        this._compareItems.push(header);
    }

    getPromises (): Array<PromiseCallback> {
        return [];
    }

    getValid (): boolean {
        return this._compareItems.every((item) => item.getValid());
    }
}