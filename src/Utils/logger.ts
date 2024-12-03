import P from 'pino'

export enum Level {
    trace,
    debug,
    info,
    warn,
    error,
}

export interface ILogger {  
    getLevel(): Level;  
    setLevel(level: Level);
    child(obj: Record<string, any>): ILogger;
    trace(obj: unknown, msg?: string);
    debug(obj: unknown, msg?: string);
    info(obj: unknown, msg?: string);
    warn(obj: unknown, msg?: string);
    error(obj: unknown, msg?: string);
}

export class PinoLoggerAdapter implements ILogger {
    constructor(private pino: P.Logger) {}

    getLevel(): Level {
        switch (this.pino.level) {
            case "trace":
                return Level.trace;
            case "debug":
                return Level.debug;
            case "info":
                return Level.info;
            case "warn":
                return Level.warn;
            case "error":
                return Level.error;
            default:
                throw new Error('unsupported level');
        }
    }

    setLevel(level: Level) {      
        switch (level) {
            case Level.trace:
                this.pino.level = "trace";
                return
            case Level.debug:
                this.pino.level = "debug";
                return
            case Level.info:
                this.pino.level = "info";
                return
            case Level.warn:
                this.pino.level = "warn";
                return
            case Level.error:
                this.pino.level = "error";
                return
            default:
                throw new Error('unsupported level');
        }
    }

    child(obj: Record<string, any>): ILogger {
        return new PinoLoggerAdapter(this.pino.child(obj))
    }

    trace(obj: unknown, msg?: string) {
        this.pino.trace(obj, msg)
    }

    debug(obj: unknown, msg?: string) {
        this.pino.debug(obj, msg)
    }

    info(obj: unknown, msg?: string) {
        this.pino.info(obj, msg)
    }

    warn(obj: unknown, msg?: string) {
        this.pino.warn(obj, msg)
    }

    error(obj: unknown, msg?: string) {
        this.pino.error(obj, msg)
    }
}

const logger = new PinoLoggerAdapter(
    P({ timestamp: () => `,"time":"${new Date().toJSON()}"` })
);

export default logger;
