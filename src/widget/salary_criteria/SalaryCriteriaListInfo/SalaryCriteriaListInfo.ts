import { Component } from '@/shared/component/Component.ts';


export class SalaryCriteriaListInfo extends Component<HTMLDivElement> {
    constructor () {
        const amount: number = document.querySelectorAll(`.project-list tbody tr`).length;

        super(
            'div',
            {
                innerHTML: `Количество категорий: ${ amount }`,
            },
        );
    }
}