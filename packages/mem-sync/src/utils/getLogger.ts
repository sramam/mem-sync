import { Logger, ILogObj } from "tslog";

/**
 * A simple wrapper to get a singleton logger - can be invoked
 * multiple times, from different modules. This
 */
export const getLogger = (() => {
  // we aren't sure if the logger is a singleton. 
  // we are only interested in the pretty messages.
  const loggers: Record<string, Logger<ILogObj>> = {};
  return (
    name: string,
    type: "json" | "pretty" | "hidden" | undefined = "hidden"
  ) => {
    const log = loggers[name] ?? new Logger({ name, type });
    loggers[name] = log;
    return log;
  };
})();
