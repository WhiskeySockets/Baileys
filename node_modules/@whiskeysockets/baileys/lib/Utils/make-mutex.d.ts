export declare const makeMutex: () => {
    mutex<T>(code: () => Promise<T> | T): Promise<T>;
};
export type Mutex = ReturnType<typeof makeMutex>;
export declare const makeKeyedMutex: () => {
    mutex<T>(key: string, task: () => Promise<T> | T): Promise<T>;
};
//# sourceMappingURL=make-mutex.d.ts.map