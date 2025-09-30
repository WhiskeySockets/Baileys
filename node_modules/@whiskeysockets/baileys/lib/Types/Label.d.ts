export interface Label {
    /** Label uniq ID */
    id: string;
    /** Label name */
    name: string;
    /** Label color ID */
    color: number;
    /** Is label has been deleted */
    deleted: boolean;
    /** WhatsApp has 5 predefined labels (New customer, New order & etc) */
    predefinedId?: string;
}
export interface LabelActionBody {
    id: string;
    /** Label name */
    name?: string;
    /** Label color ID */
    color?: number;
    /** Is label has been deleted */
    deleted?: boolean;
    /** WhatsApp has 5 predefined labels (New customer, New order & etc) */
    predefinedId?: number;
}
/** WhatsApp has 20 predefined colors */
export declare enum LabelColor {
    Color1 = 0,
    Color2 = 1,
    Color3 = 2,
    Color4 = 3,
    Color5 = 4,
    Color6 = 5,
    Color7 = 6,
    Color8 = 7,
    Color9 = 8,
    Color10 = 9,
    Color11 = 10,
    Color12 = 11,
    Color13 = 12,
    Color14 = 13,
    Color15 = 14,
    Color16 = 15,
    Color17 = 16,
    Color18 = 17,
    Color19 = 18,
    Color20 = 19
}
//# sourceMappingURL=Label.d.ts.map