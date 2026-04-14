export const removeInnerProperties =
    <T extends Record<string, unknown>>(obj: T, propertiesToInclude: string[]): T => {
        return Object.fromEntries(
            Object.entries(obj).map(([key, value]) => {
                if (typeof value === 'object' && !Array.isArray(value)) {
                    return [key, Object.fromEntries(
                        Object.entries(value as Record<string, object>).filter(([prop]) => propertiesToInclude.includes(prop))
                    )];
                }
                return [key, value];
            })
        ) as T;
    };


export const reverseOrderOfKeysInObj = <T extends Record<string, object>>(obj: T) => {
    const reversedKeys = Object.keys(obj).reverse();
    return Object.fromEntries(reversedKeys.map(key => [key, obj[key]])) as T;
}