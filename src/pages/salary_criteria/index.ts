import { startHandler } from '@/shared/lib/startHandler.ts';
import { Col } from '@/shared/box/Col/Col.ts';
import {
    SalaryCriteriaListInfo,
} from '@/widget/salary_criteria/SalaryCriteriaListInfo/SalaryCriteriaListInfo.ts';
import { CompareHeader } from '@/entity/compare/CompareHeader/CompareHeader.ts';


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
/*        const clientId  = location.pathname.split('/')[3];
        const bearer    = getBearerTokenDomAction();*/

        if (container) {
            new Col({
                rows: [
                    new SalaryCriteriaListInfo(),
                    new CompareHeader({
                        targetHeaderData: 'Original',
                        label           : 'Original',
                        clientHeaderData: 'Original',
                        rows            : [],
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
                    new CompareHeader({
                        targetHeaderData: 'Original',
                        label           : 'Original',
                        clientHeaderData: 'Original2',
                        rows            : [],
                        variants        : [],
                        onVariantChange : () => {
                        },
                    }),
                    ...Object.keys(mockOriginalData.items).map((key) => (
                        new CompareHeader({
                            targetHeaderData: mockOriginalData.items[key].title,
                            clientHeaderData: mockCompareData.items[key]?.title,
                            label           : 'item',
                            variants        : Object.keys(mockCompareData.items).map((key) => ({
                                label: mockCompareData.items[key].title,
                                value: key,
                            })),
                            rows            : [],
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