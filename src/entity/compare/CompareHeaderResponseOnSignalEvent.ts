import {
    ICompareHeader,
} from '@/entity/compare/CompareHeader/CompareHeader.interface.ts';


export type CompareHeaderResponseOnSignalDetails = {
    type: string;
    header: ICompareHeader;
}

export const CompareHeaderSignalEventType           = 'compare-header-signal';
export const CompareHeaderResponseOnSignalEventType = 'compare-header-response-on-signal';

export const CompareHeaderResponseOnSignalEvent = function (details: CompareHeaderResponseOnSignalDetails) {
    return new CustomEvent<CompareHeaderResponseOnSignalDetails>(CompareHeaderResponseOnSignalEventType, {
        bubbles   : true,
        cancelable: true,
        detail    : details,
    });
};

export const CompareHeaderSignalEvent = new Event(CompareHeaderSignalEventType, {
    bubbles   : false,
    cancelable: false,
});