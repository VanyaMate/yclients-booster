// мега костыль
export const Is = function <T> (value: unknown): value is T {
    return !value ? true : true;
};