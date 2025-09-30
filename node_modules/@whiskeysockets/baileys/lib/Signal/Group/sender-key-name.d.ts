interface Sender {
    id: string;
    deviceId: number;
    toString(): string;
}
export declare class SenderKeyName {
    private readonly groupId;
    private readonly sender;
    constructor(groupId: string, sender: Sender);
    getGroupId(): string;
    getSender(): Sender;
    serialize(): string;
    toString(): string;
    equals(other: SenderKeyName | null): boolean;
    hashCode(): number;
}
export {};
//# sourceMappingURL=sender-key-name.d.ts.map