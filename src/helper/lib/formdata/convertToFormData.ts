export const convertToFormData = function (obj: Record<any, any>): FormData {
    const formData = new FormData();
    Object.entries(obj).forEach(([ key, value ]) => {
        formData.set(key, value);
    });
    return formData;
};