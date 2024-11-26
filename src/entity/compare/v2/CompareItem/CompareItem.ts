import {
    CompareValidType,
    ICompareComponent,
    ICompareItem,
} from '@/entity/compare/v2/CompareItem/CompareItem.interface.ts';
import { Details, DetailsProps } from '@/shared/box/Details/Details.ts';
import { Col } from '@/shared/box/Col/Col.ts';


export type CompareItemProps =
    Omit<DetailsProps, 'header' | 'details'>
    & {
        header: ICompareComponent<HTMLElement>;
        rows: Array<ICompareComponent<HTMLElement>>;
    };

export class CompareItem extends Details implements ICompareItem {
    private _header: ICompareComponent<HTMLElement>;
    private _rows: Array<ICompareComponent<HTMLElement>>;

    constructor (props: CompareItemProps) {
        const { header, rows, ...other } = props;
        super({ header, details: new Col({ rows }), ...other });
        this._header = header;
        this._rows   = rows;
    }

    action<T> (): Promise<T> {
        throw new Error('Method not implemented.');
    }

    getValidationType (): CompareValidType {
        const headerValidationType = this._header.getValidationType();
        if (this._header.getValidationType() !== CompareValidType.VALID) {
            return headerValidationType;
        }

        for (let i = 0; i < this._rows.length; i++) {
            if (this._rows[i].getValidationType() !== CompareValidType.VALID) {
                return CompareValidType.NO_VALID;
            }
        }

        return CompareValidType.VALID;
    }
}