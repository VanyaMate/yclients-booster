import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    CopySalaryCriteriaFromThisToOtherButton,
} from '@/widget/salary_criteria/CopySalaryCriteriaFromThisToOtherButton/CopySalaryCriteriaFromThisToOtherButton.ts';
import {
    SalaryCriteriaListInfo,
} from '@/widget/salary_criteria/SalaryCriteriaListInfo/SalaryCriteriaListInfo.ts';
import {
    getBearerTokenDomAction,
} from '@/action/bearer/dom-action/getBearerToken/getBearerToken.dom-action.ts';
import {
    CompareHeaderV3,
} from '@/entity/compare/v3/CompareHeaderV3/CompareHeaderV3.ts';
import { CompareRowV3 } from '@/entity/compare/v3/CompareRowV3/CompareRowV3.ts';


export const isSalaryCriteriaPage = function (pathnameParts: Array<string>): boolean {
    return pathnameParts[1] === 'salary_criteria' && !!pathnameParts[3].match(/\d+/);
};

type MockRow = {
    title: string;
    description: string;
    amount: number;
}

type MockItem = {
    title: string;
    description: string;
    rows: Array<string>;
}

type MockRows = Record<string, MockRow>;
type MockItems = Record<string, MockItem>;


const mockOriginalData: { rows: MockRows, items: MockItems } = {
    rows : {
        '1': {
            title      : 'Row title 1',
            description: 'Description row #1',
            amount     : 1,
        },
        '2': {
            title      : 'Row title 2',
            description: 'Description row #2',
            amount     : 2,
        },
        '3': {
            title      : 'Row title 3',
            description: 'Description row #3',
            amount     : 3,
        },
    },
    items: {
        '1': {
            title      : 'Item title 1',
            description: 'Description [item] @1',
            rows       : [ '1', '2' ],
        },
        '2': {
            title      : 'Item title 2',
            description: 'Description [item] @2',
            rows       : [ '3' ],
        },
    },
};

const mockCompareData: { rows: MockRows, items: MockItems } = {
    rows : {
        '1': {
            title      : 'Row title 1',
            description: 'Description row #1',
            amount     : 1,
        },
        '2': {
            title      : 'Row title 4',
            description: 'Description row #4',
            amount     : 4,
        },
        '3': {
            title      : 'Row title 3',
            description: 'Description row #3',
            amount     : 3,
        },
    },
    items: {
        '1': {
            title      : 'Item title 1',
            description: 'Description [item] @1',
            rows       : [ '1', '2' ],
        },
        '2': {
            title      : 'Item title 2',
            description: 'Description [item] @2',
            rows       : [ '3' ],
        },
    },
};

export const salaryCriteriaPageHandler = function () {
    startHandler(() => {
        const container = document.querySelector('.wrapper-content');
        const clientId  = location.pathname.split('/')[3];
        const bearer    = getBearerTokenDomAction();

        if (container) {
            new Col({
                rows: [
                    new CopySalaryCriteriaFromThisToOtherButton(clientId, bearer),
                    new SalaryCriteriaListInfo(),
                    new CompareHeaderV3({
                        targetHeaderData: 'Original',
                        label           : 'Original',
                        clientHeaderData: 'Original',
                        rows            : [
                            new CompareRowV3({
                                targetData: 'Original',
                                label     : 'Original',
                                clientData: 'Original',
                            }),
                            new CompareRowV3({
                                targetData: 'Original',
                                label     : 'Original',
                                clientData: 'Original2',
                            }),
                        ],
                        variants       : [
                            {
                                value: '1',
                                label: 'Orignal1',
                            },
                            {
                                value: '2',
                                label: 'Orignal2',
                            },
                            {
                                value: '3',
                                label: 'Orignal3',
                            },
                        ],
                        onVariantChange: (variant) => {
                            console.log('rerender children with', variant);
                        },
                    }),
                    new CompareHeaderV3({
                        targetHeaderData: 'Original',
                        label           : 'Original',
                        clientHeaderData: 'Original2',
                        rows            : [],
                        variants        : [],
                        onVariantChange : () => {
                        },
                    }),
                    ...Object.keys(mockOriginalData.items).map((key) => (
                        new CompareHeaderV3({
                            targetHeaderData: mockOriginalData.items[key].title,
                            clientHeaderData: mockCompareData.items[key]?.title,
                            label           : 'item',
                            variants        : Object.keys(mockCompareData.items).map((key) => ({
                                label: mockCompareData.items[key].title,
                                value: key,
                            })),
                            rows            : [
                                new CompareRowV3({
                                    targetData: mockOriginalData.items[key].description,
                                    clientData: mockCompareData.items[key]?.description,
                                    label     : 'описание',
                                }),

                            ],
                            onVariantChange: () => {
                            },
                        })
                    )),
                ],
            })
                .insert(container, 'afterbegin');
        }
    });
};