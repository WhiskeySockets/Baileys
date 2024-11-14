export declare const makeMutex: () => {
    mutex<T>(code: () => T | Promise<T>): Promise<T>;
};
export type Mutex = ReturnType<typeof makeMutex>;
export declare const makeKeyedMutex: () => {
    mutex<T>(key: string, task: () => T | Promise<T>): Promise<T>;
};
