import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import {
    SettingsServiceData,
} from '@/action/settings/service_categories/types/settings-service_categories.types.ts';
import {
    SettingsServiceMassivePriceUpdateCompareData,
    SettingsServiceMassivePriceUpdateData,
} from '@/widget/settings/service/SettingsServiceMassivePriceUpdate/types/SettingsServiceMassivePriceUpdate.types.ts';
import { Button } from '@/shared/buttons/Button/Button.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import { Table } from '@/shared/table/Table/Table.ts';
import { TextArea } from '@/shared/input/TextArea/TextArea.ts';
import { ProgressBar } from '@/shared/progress/ProgressBar/ProgressBar.ts';
import { PromiseSplitter } from '@/service/PromiseSplitter/PromiseSplitter.ts';
import {
    PROMISE_SPLITTER_MAX_REQUESTS, PROMISE_SPLITTER_MAX_RETRY,
} from '@/service/PromiseSplitter/const/const.ts';
import {
    updateSettingsServiceByMassEditRequestAction,
} from '@/action/settings/service_categories/request-action/updateSettingsServiceByMassEdit/updateSettingsServiceByMassEdit.request-action.ts';
import { Logger } from '@/entity/logger/Logger/Logger.ts';
import {
    getSettingsServicesRequestAction,
} from '@/action/settings/service_categories/request-action/getSettingsServices/getSettingsServices.request-action.ts';
import css from './SettingsServiceMassivePriceUpdate.module.css';


export type SettingsServiceMassivePriceUpdateProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        clientId: string;
        bearer: string;
    };

export class SettingsServiceMassivePriceUpdate extends Component<HTMLDivElement> {
    private readonly _clientId: string;
    private readonly _bearer: string;
    private readonly _col: Col;
    private readonly _logger?: Logger;
    private readonly _progress?: ProgressBar;
    private readonly _promiseSplitter: PromiseSplitter = new PromiseSplitter(
        PROMISE_SPLITTER_MAX_REQUESTS,
        PROMISE_SPLITTER_MAX_RETRY,
    );

    constructor (props: SettingsServiceMassivePriceUpdateProps) {
        const { clientId, bearer, ...other } = props;
        super('div', other);
        this._clientId = clientId;
        this._bearer   = bearer;

        const textInput = new TextArea({
            placeholder: 'Формат Id/Price_min/Price_max',
            className  : css.textarea,
        });

        const submit = new Button({
            textContent: 'Сравнить',
            onclick    : () => {
                submit.setLoading(true);
                textInput.setDisable(true);
                this._uploadServices()
                    .then((response) => {
                        const services             = response.data;
                        submit.element.textContent = 'Обновить';
                        submit.setLoading(false);
                        const updateData       = this._parseUpdateData(textInput.getValue());
                        const compareData      = this._compareData(services, updateData);
                        submit.element.onclick = () => {
                            submit.setLoading(true);
                            this._updateData(compareData).then(() => {
                                submit.element.textContent = 'Готово';
                                submit.element.onclick     = () => {
                                };
                            });
                        };
                        textInput.remove();
                        this._renderServices(compareData, updateData);
                    });
            },
        });

        this._logger   = new Logger({});
        this._progress = new ProgressBar({
            max: 0,
        });

        this._col = new Col({
            rows: [
                this._progress,
                this._logger,
                textInput,
                submit,
            ],
        });

        this.element.classList.add(css.container);
        this._col.insert(this.element, 'afterbegin');
    }

    private _renderServices (services: SettingsServiceMassivePriceUpdateCompareData, updateData: SettingsServiceMassivePriceUpdateData) {
        const successTable = new Table({
            header: [ 'id', 'ДО price_min', 'ПОСЛЕ price_min', 'ДО price_max', 'ПОСЛЕ price_max' ],
        });
        const invalidTable = new Table({
            header: [ 'id' ],
        });

        updateData.forEach((data) => {
            const service = services[data.id];
            if (service) {
                successTable.addRow([
                    data.id,
                    service.price_min.before.toString(),
                    service.price_min.after.toString(),
                    service.price_max.before.toString(),
                    service.price_max.after.toString(),
                ]);
            } else {
                invalidTable.addRow([
                    data.id,
                ]);
            }
        });

        this._col.add(new Component<HTMLHeadingElement>('h2', { textContent: 'Не найденные' }));
        this._col.add(invalidTable);
        this._col.add(new Component<HTMLHeadingElement>('h2', { textContent: 'Найденные' }));
        this._col.add(successTable);
    }

    private _uploadServices () {
        return getSettingsServicesRequestAction(this._bearer, this._clientId, this._logger);
    }

    private _parseUpdateData (value: string): SettingsServiceMassivePriceUpdateData {
        const rows = value.split('\n');
        return rows.map((row) => {
            const [ id, priceMin, priceMax ] = row.split('\t');
            return {
                id,
                price_min: Number(priceMin),
                price_max: Number(priceMax),
            };
        });
    }

    private _compareData (services: Array<SettingsServiceData>, updateData: SettingsServiceMassivePriceUpdateData): SettingsServiceMassivePriceUpdateCompareData {
        const compareData: SettingsServiceMassivePriceUpdateCompareData = {};

        updateData.forEach((data) => {
            const service = services.find((service) => service.id.toString() === data.id);
            if (service) {
                const cardIds: Set<number> = new Set();
                service.staff.forEach((staff) => cardIds.add(staff.technological_card_id));
                cardIds.delete(0);

                compareData[data.id] = {
                    id                   : data.id,
                    title                : service.title,
                    technological_card_id: cardIds.size === 1
                                           ? [ ...cardIds ][0].toString()
                                           : undefined,
                    length_minute        : Math.floor(service.duration / 60 % 60),
                    length_hour          : Math.floor(service.duration / 60 / 60),
                    price_max            : {
                        before: service.price_max,
                        after : data.price_max,
                    },
                    price_min            : {
                        before: service.price_min,
                        after : data.price_min,
                    },
                };
            }
        });

        return compareData;
    }

    private _updateData (updateData: SettingsServiceMassivePriceUpdateCompareData) {
        let success: number = 0;
        let invalid: number = 0;

        const ids = Object.keys(updateData);

        return this._promiseSplitter.exec(
            ids.map((id) => ({
                chain   : [
                    () => updateSettingsServiceByMassEditRequestAction(
                        this._bearer,
                        this._clientId,
                        id,
                        {
                            ...updateData[id],
                            price_min: updateData[id].price_min.after,
                            price_max: updateData[id].price_max.after,
                        },
                        this._logger,
                    )
                        .then(() => this._progress?.setLeftProgress(++success))
                        .catch(() => this._progress?.setRightProgress(++invalid)),
                ],
                onBefore: () => {
                    this._progress?.reset(ids.length);
                },
            })),
        );
    }
}