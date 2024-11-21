export const rgbToHex = function (rgbColor: string): string {
    if (rgbColor.charAt(0) == 'r') {
        const parts = rgbColor.match(/\d+/gi);
        if (parts) {
            const r = parseInt(parts[0]).toString(16).padStart(2, '0');
            const g = parseInt(parts[1]).toString(16).padStart(2, '0');
            const b = parseInt(parts[2]).toString(16).padStart(2, '0');

            return `#${ r }${ g }${ b }`;
        }
    }

    throw new Error(`Невозможно преобразовать RGB "${ rgbColor }" в HEX`);
};