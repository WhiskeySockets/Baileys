export declare class ObjectRepository<T extends object> {
    readonly entityMap: Map<string, T>;
    constructor(entities?: Record<string, T>);
    findById(id: string): T | undefined;
    findAll(): T[];
    upsertById(id: string, entity: T): Map<string, T>;
    deleteById(id: string): boolean;
    count(): number;
    toJSON(): T[];
}
