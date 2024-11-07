import { IComponent } from '@/shared/component/Component.interface.ts';


export type ComponentProps<T extends HTMLElement> =
    {
        [Key in keyof T]: T[Key];
    };

export type ComponentPropsOptional<T extends HTMLElement> = Partial<ComponentProps<T>>;

export class Component<T extends HTMLElement> implements IComponent<T> {
    private readonly _element: T;

    constructor (tag: string, props: ComponentPropsOptional<T>, children: Array<Component<HTMLElement>> = []) {
        this._element = Object.assign(document.createElement(tag), props as ComponentProps<T>);
        children.forEach((child) => child.insert(this.element, 'beforeend'));
    }

    get element () {
        return this._element;
    }

    insert (to: Element, position: InsertPosition): void {
        to.insertAdjacentElement(position, this._element);
    }

    remove (): void {
        this._element.remove();
    }

    clear (): void {
        this.element.innerHTML = ``;
    }
}