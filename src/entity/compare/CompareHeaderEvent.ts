import { CompareType } from '@/entity/compare/Compare.types.ts';


export type CompareHeaderEventDetails = {
    compareType: CompareType;
    headerType: string,
    once: boolean;
}

export const CompareHeaderEventType = 'compare-header-mass-update';

export const CompareHeaderEvent = function (details: CompareHeaderEventDetails) {
    return new CustomEvent<CompareHeaderEventDetails>(CompareHeaderEventType, {
        bubbles   : true,
        cancelable: details.once,
        detail    : details,
    });
};
