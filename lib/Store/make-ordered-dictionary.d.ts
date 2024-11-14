declare function makeOrderedDictionary<T>(idGetter: (item: T) => string): {
    array: T[];
    get: (id: string) => T | undefined;
    upsert: (item: T, mode: 'append' | 'prepend') => void;
    update: (item: T) => boolean;
    remove: (item: T) => boolean;
    updateAssign: (id: string, update: Partial<T>) => boolean;
    clear: () => void;
    filter: (contain: (item: T) => boolean) => void;
    toJSON: () => T[];
    fromJSON: (newItems: T[]) => void;
};
export default makeOrderedDictionary;
