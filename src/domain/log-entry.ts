import { LogLevel } from "./log-level";

export interface LogEntry {
  timestamp: number;
  loglevel: LogLevel;
  transactionId: string;
  err: string | null;
}

export interface LogSource {
  readNextLine(): Promise<string | null>;
}

export interface LogSink {
  write(logEntry: LogEntry): void;
  close(): void;
}
