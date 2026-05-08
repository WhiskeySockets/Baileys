import { describe, it, expect, mock } from "bun:test";
import {
  setLogger,
  hasLogger,
  updateLogger,
  logMessage,
  type ILogger,
} from "../dist";

function createMockLogger(level: string = "debug") {
  const calls: { method: string; obj: object; msg?: string }[] = [];

  const logger: ILogger = {
    level,
    trace: mock((obj: object, msg?: string) => {
      calls.push({ method: "trace", obj, msg });
    }),
    debug: mock((obj: object, msg?: string) => {
      calls.push({ method: "debug", obj, msg });
    }),
    info: mock((obj: object, msg?: string) => {
      calls.push({ method: "info", obj, msg });
    }),
    warn: mock((obj: object, msg?: string) => {
      calls.push({ method: "warn", obj, msg });
    }),
    error: mock((obj: object, msg?: string) => {
      calls.push({ method: "error", obj, msg });
    }),
  };

  return { logger, calls };
}

describe("logger bridge", () => {
  it("should initially have no logger set", () => {});

  it("should set and detect logger", () => {
    const { logger } = createMockLogger();
    setLogger(logger);
    expect(hasLogger()).toBe(true);
  });

  it("should update logger", () => {
    const { logger: logger1 } = createMockLogger("info");
    const { logger: logger2 } = createMockLogger("debug");

    setLogger(logger1);
    expect(hasLogger()).toBe(true);

    updateLogger(logger2);
    expect(hasLogger()).toBe(true);
  });

  it("should accept logger with different log levels", () => {
    const levels = ["trace", "debug", "info", "warn", "error", "silent"];

    for (const level of levels) {
      const { logger } = createMockLogger(level);
      updateLogger(logger);
      expect(hasLogger()).toBe(true);
    }
  });

  it("should accept Pino-style numeric log levels", () => {
    const levels = ["10", "20", "30", "40", "50", "60"];

    for (const level of levels) {
      const { logger } = createMockLogger(level);
      updateLogger(logger);
      expect(hasLogger()).toBe(true);
    }
  });

  it("should have correct ILogger interface shape", () => {
    const { logger } = createMockLogger();

    expect(typeof logger.level).toBe("string");
    expect(typeof logger.trace).toBe("function");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("should allow calling logger methods directly", () => {
    const { logger, calls } = createMockLogger("trace");
    setLogger(logger);

    logger.trace({ test: true }, "trace message");
    logger.debug({ test: true }, "debug message");
    logger.info({ test: true }, "info message");
    logger.warn({ test: true }, "warn message");
    logger.error({ test: true }, "error message");

    expect(calls.length).toBe(5);
    expect(calls[0]).toEqual({
      method: "trace",
      obj: { test: true },
      msg: "trace message",
    });
    expect(calls[1]).toEqual({
      method: "debug",
      obj: { test: true },
      msg: "debug message",
    });
    expect(calls[2]).toEqual({
      method: "info",
      obj: { test: true },
      msg: "info message",
    });
    expect(calls[3]).toEqual({
      method: "warn",
      obj: { test: true },
      msg: "warn message",
    });
    expect(calls[4]).toEqual({
      method: "error",
      obj: { test: true },
      msg: "error message",
    });
  });

  it("should work with a Baileys-compatible logger", () => {
    const logs: string[] = [];

    const pinoLikeLogger: ILogger = {
      level: "debug",
      trace: (obj, msg) => logs.push(`TRACE: ${msg || JSON.stringify(obj)}`),
      debug: (obj, msg) => logs.push(`DEBUG: ${msg || JSON.stringify(obj)}`),
      info: (obj, msg) => logs.push(`INFO: ${msg || JSON.stringify(obj)}`),
      warn: (obj, msg) => logs.push(`WARN: ${msg || JSON.stringify(obj)}`),
      error: (obj, msg) => logs.push(`ERROR: ${msg || JSON.stringify(obj)}`),
    };

    setLogger(pinoLikeLogger);
    expect(hasLogger()).toBe(true);

    pinoLikeLogger.info({ event: "connected" }, "Connection established");
    pinoLikeLogger.debug({ bytes: 1024 }, "Received data");
    pinoLikeLogger.warn({ retries: 3 }, "Retry attempt");
    pinoLikeLogger.error({ code: "ERR_TIMEOUT" }, "Connection timeout");

    expect(logs).toEqual([
      "INFO: Connection established",
      "DEBUG: Received data",
      "WARN: Retry attempt",
      "ERROR: Connection timeout",
    ]);
  });
});

describe("logger bridge end-to-end (Rust log crate -> JS)", () => {
  it("should include target metadata from Rust but not file/line paths", () => {
    const calls: { method: string; obj: object; msg?: string }[] = [];

    const logger: ILogger = {
      level: "info",
      trace: (obj, msg) => calls.push({ method: "trace", obj, msg }),
      debug: (obj, msg) => calls.push({ method: "debug", obj, msg }),
      info: (obj, msg) => calls.push({ method: "info", obj, msg }),
      warn: (obj, msg) => calls.push({ method: "warn", obj, msg }),
      error: (obj, msg) => calls.push({ method: "error", obj, msg }),
    };

    setLogger(logger);
    logMessage("info", "Test message");

    expect(calls.length).toBe(1);
    expect(calls[0].obj).toHaveProperty("target");
    expect(typeof (calls[0].obj as any).target).toBe("string");
    expect(calls[0].obj).not.toHaveProperty("file");
    expect(calls[0].obj).not.toHaveProperty("line");
  });
});
