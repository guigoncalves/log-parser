import { parseISO, getTime } from "date-fns";
import { LogSource, LogSink, LogEntry } from "./log-entry";
import { LogLevel } from "./log-level";

export class LogParser {
  constructor(
    private readonly logSource: LogSource,
    private readonly logSink: LogSink,
    private readonly minLogLevel: LogLevel = LogLevel.ERROR
  ) {}

  public async parse(): Promise<void> {
    let line: string | null;

    while ((line = await this.logSource.readNextLine()) !== null) {
      const logEntry = this.parseLine(line);
      if (logEntry && this.shouldProcess(logEntry)) {
        await this.logSink.write(logEntry);
      }
    }
    this.logSink.close();
  }

  private parseLine(line: string): LogEntry | null {
    const regex =
      /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - (\w+) - (.+)/;
    const match = line.match(regex);

    if (!match) {
      console.warn(`Invalid log format in line: ${line}`);
      return null;
    }

    let [, date, loglevel, json] = match;
    const logLevelEnum: LogLevel = loglevel as LogLevel;
    const isValidLogLevel = Object.values(LogLevel).includes(logLevelEnum);

    if (!isValidLogLevel) {
      console.warn(`Invalid log level "${loglevel}" in line: ${line}`);
      return null;
    }

    let parsedJson;
    try {
      parsedJson = JSON.parse(json);
    } catch (err) {
      console.warn(`Failed to parse json "${json}" in line: ${line}`);
      return null;
    }

    const timestamp = getTime(parseISO(date));

    return {
      timestamp,
      loglevel: logLevelEnum,
      transactionId: parsedJson.transactionId,
      err: parsedJson.err || null,
    };
  }

  private shouldProcess(entry: LogEntry): boolean {
    const logLevelValue = Object.values(LogLevel).indexOf(entry.loglevel);
    const minLogLevelValue = Object.values(LogLevel).indexOf(this.minLogLevel);
    return logLevelValue <= minLogLevelValue;
  }
}
