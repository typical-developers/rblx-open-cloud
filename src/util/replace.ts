import { DeepPartial } from '../types/global';

/**
 * @param data The complete data
 * @param newData New data that you want to append or overwrite.
 */
export function deepReplace<T = object>(data: T, newData: DeepPartial<T>) {
    const newKeys = Object.keys(newData);

    for (const key of newKeys) {
        const oldValue = data[key];
        const newValue = newData[key];

        if (typeof oldValue === 'object' && typeof newValue === 'object') {
            if (Array.isArray(oldValue) && JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
                data[key] = newValue;
            } else {
                data[key] = deepReplace(oldValue, newValue);
            }
        } else if (oldValue !== newValue) {
            data[key] = newValue;
        }
    }

    return data;
}
