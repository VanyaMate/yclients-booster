export const getValidDates = function (value: Array<string>): Array<Date> | undefined {
    const dates = value
        .map((item) => new Date(item))
        .filter((date) => date.toString() !== 'Invalid Date');

    if (dates.length) {
        return dates;
    }

    return undefined;
};