export interface IComponent<T> {
    element: T;

    insert (to: Element, position: InsertPosition): void;

    remove (): void;
}