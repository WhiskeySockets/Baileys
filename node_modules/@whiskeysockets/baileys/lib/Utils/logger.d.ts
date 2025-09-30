export interface ILogger {
    level: string;
    child(obj: Record<string, unknown>): ILogger;
    trace(obj: unknown, msg?: string): void;
    debug(obj: unknown, msg?: string): void;
    info(obj: unknown, msg?: string): void;
    warn(obj: unknown, msg?: string): void;
    error(obj: unknown, msg?: string): void;
}
declare const _default: import("pino").Logger<never, boolean>;
export default _default;
//# sourceMappingURL=logger.d.ts.map