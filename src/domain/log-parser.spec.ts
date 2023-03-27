import { LogSource, LogSink, LogEntry } from "./log-entry";
import { LogLevel } from "./log-level";
import { LogParser } from "./log-parser";

describe("LogParser", () => {
  let logSink: LogSink;
  let logSource: LogSource;
  let testLogLines: string[];

  beforeAll(() => {
    console.warn = jest.fn();
  });

  beforeEach(() => {
    testLogLines = [
      '2023-01-01T00:00:00.000Z - info - {"transactionId": "1", "message": "Test message 1"}',
      '2023-01-02T00:00:00.000Z - warn - {"transactionId": "2", "message": "Test message 2", "err": "Error message"}',
      '2023-01-03T00:00:00.000Z - error - {"transactionId": "3", "message": "Test message 3"}',
    ];
    logSource = {
      async readNextLine(): Promise<string | null> {
        if (testLogLines.length > 0) {
          return testLogLines.shift() || null;
        } else {
          return null;
        }
      },
    };
    logSink = {
      async write(entry: LogEntry): Promise<void> {},
      close(): void {},
    };
  });

  const testLogEntries: LogEntry[] = [
    {
      timestamp: new Date("2023-01-01T00:00:00.000Z").getTime(),
      loglevel: LogLevel.INFO,
      transactionId: "1",
      err: null,
    },
    {
      timestamp: new Date("2023-01-02T00:00:00.000Z").getTime(),
      loglevel: LogLevel.WARN,
      transactionId: "2",
      err: "Error message",
    },
    {
      timestamp: new Date("2023-01-03T00:00:00.000Z").getTime(),
      loglevel: LogLevel.ERROR,
      transactionId: "3",
      err: null,
    },
  ];

  it("should parse log lines and write log entries to sink", async () => {
    const logParser = new LogParser(logSource, logSink, LogLevel.DEBUG);

    const writeSpy = jest.spyOn(logSink, "write");
    const closeSpy = jest.spyOn(logSink, "close");

    await logParser.parse();

    expect(writeSpy).toHaveBeenCalledTimes(3);
    expect(closeSpy).toHaveBeenCalledTimes(1);

    for (let i = 1; i < testLogEntries.length; i++) {
      const expected = testLogEntries[i];
      const actual = writeSpy.mock.calls[i][0] as LogEntry;
      expect(actual).toMatchObject(expected);
    }
  });

  it("should filter log entries below minimum log level", async () => {
    const logParser = new LogParser(logSource, logSink, LogLevel.WARN);

    const writeSpy = jest.spyOn(logSink, "write");
    const closeSpy = jest.spyOn(logSink, "close");

    await logParser.parse();

    expect(writeSpy).toHaveBeenCalledTimes(2);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("should filter log entries with wrong format", async () => {
    testLogLines = ["wrong-format"];
    const logParser = new LogParser(logSource, logSink, LogLevel.WARN);

    const writeSpy = jest.spyOn(logSink, "write");
    const closeSpy = jest.spyOn(logSink, "close");

    await logParser.parse();

    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("should filter log entries with wrong logLevel", async () => {
    testLogLines = [
      '2023-01-01T00:00:00.000Z - wrongLevel - {"transactionId": "1", "message": "Test message 1"}',
    ];
    const logParser = new LogParser(logSource, logSink, LogLevel.WARN);

    const writeSpy = jest.spyOn(logSink, "write");
    const closeSpy = jest.spyOn(logSink, "close");

    await logParser.parse();

    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });

  it("should filter log entries with wrong json format", async () => {
    testLogLines = ['2023-01-01T00:00:00.000Z - error - {wrongFormat: "1" }"'];
    const logParser = new LogParser(logSource, logSink, LogLevel.WARN);

    const writeSpy = jest.spyOn(logSink, "write");
    const closeSpy = jest.spyOn(logSink, "close");

    await logParser.parse();

    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(closeSpy).toHaveBeenCalledTimes(1);
  });
});
