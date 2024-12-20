export const formatDateToDayMonthYear = (date: Date): string => {
    const day   = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяцы начинаются с 0
    const year  = date.getFullYear();
    return `${ day }-${ month }-${ year }`;
};

export function getDatesBetween (startDate: string | Date, endDate: string | Date): Array<Date> {
    const start              = new Date(startDate);
    const end                = new Date(endDate);
    const dates: Array<Date> = [];

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new Error('Одна из дат имеет некорректный формат');
    }

    if (start > end) {
        throw new Error('startDate должна быть меньше или равна endDate');
    }

    let currentDate = new Date(start);

    while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    return dates;
}