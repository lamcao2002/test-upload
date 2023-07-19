import { transports, createLogger, format, Logger } from "winston";
const { combine, timestamp, label, printf } = format;

const ConsoleLogLevel = "debug";

const customFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
  });

function createModuleLogger(moduleName: string): Logger {
  return createLogger({
    format: combine(format.colorize(), label({ label: moduleName }),timestamp(), customFormat),
    defaultMeta: { module: moduleName },
    transports: [
      new transports.Console({
        level: "debug"
      }),
    ],
  });
}

export { ConsoleLogLevel, createModuleLogger, Logger };
