type Level = "fatal" | "error" | "warn" | "info" | "debug" | "trace";
type LevelWithSilent = Level | "silent";

interface LogFn {
    // <T extends object>(obj: T, msg?: string, ...args: any[]): void;
    (obj: unknown, msg?: string, ...args: any[]): void;
    // (msg: string, ...args: any[]): void;
}
type Bindings = Record<string, any>;


export interface Logger {
    level: LevelWithSilent | string;
    child: (bindings: Bindings) => Logger;
    fatal: LogFn;
    error: LogFn;
    warn: LogFn;
    info: LogFn;
    debug: LogFn;
    trace: LogFn;
    silent: LogFn;
}
