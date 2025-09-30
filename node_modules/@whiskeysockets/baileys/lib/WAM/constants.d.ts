export declare const WEB_EVENTS: Event[];
export declare const WEB_GLOBALS: Global[];
export declare const FLAG_BYTE = 8, FLAG_GLOBAL = 0, FLAG_EVENT = 1, FLAG_FIELD = 2, FLAG_EXTENDED = 4;
export type Event = {
    name: string;
    id: number;
    props: {
        [key: string]: [number, string | {
            [key: string]: number;
        }];
    };
    weight: number;
    wamChannel: string;
    privateStatsIdInt: number;
};
export type Global = {
    name: string;
    id: number;
    type: string | {
        [key: string]: number;
    };
    validator?: string;
    channels: string[];
};
type EventByName<T extends Event['name']> = Extract<Event, {
    name: T;
}>;
export type EventInputType = {
    [key in Event['name']]: {
        props: {
            [k in keyof EventByName<key>['props']]: Value;
        };
        globals: {
            [x: string]: Value;
        };
    };
} & {};
export type Value = number | null | string;
export {};
//# sourceMappingURL=constants.d.ts.map