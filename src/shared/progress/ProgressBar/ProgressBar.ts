import {
    Component,
    ComponentPropsOptional,
} from '@/shared/component/Component.ts';
import css from './ProgressBar.module.css';


export type ProgressBarProps =
    ComponentPropsOptional<HTMLDivElement>
    & {
        max: number;
    }

export class ProgressBar extends Component<HTMLDivElement> {
    private readonly _max: number  = 0;
    private _leftProgress: number  = 0;
    private _rightProgress: number = 0;
    private _leftProgressElement: HTMLDivElement;
    private _rightProgressElement: HTMLDivElement;
    private _percentProgressElement: HTMLDivElement;

    constructor (props: ProgressBarProps) {
        const { max, ...other } = props;
        super('div', other);

        this.element.innerHTML = `
            <div class="${ css.left }"></div>
            <div class="${ css.percent }">0%</div>
            <div class="${ css.right }"></div>
        `;

        this.element.classList.add(css.container);

        this._max                    = max;
        this._leftProgressElement    = this.element.querySelector(`.${ css.left }`)!;
        this._rightProgressElement   = this.element.querySelector(`.${ css.right }`)!;
        this._percentProgressElement = this.element.querySelector(`.${ css.percent }`)!;
    }

    setLeftProgress (value: number) {
        this._leftProgress = value;
        this._rerender();
    }

    setRightProgress (value: number) {
        this._rightProgress = value;
        this._rerender();
    }

    private _rerender () {
        const leftProgressPercent  = Math.floor(100 / this._max * this._leftProgress);
        const rightProgressPercent = Math.ceil(100 / this._max * this._rightProgress);

        this._leftProgressElement.style.width    = `${ leftProgressPercent }%`;
        this._rightProgressElement.style.width   = `${ rightProgressPercent }%`;
        this._percentProgressElement.textContent = rightProgressPercent
                                                   ? `${ leftProgressPercent }% | ${ rightProgressPercent }%`
                                                   : `${ leftProgressPercent }%`;
    }
}