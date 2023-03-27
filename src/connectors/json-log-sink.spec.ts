import fs from "fs";
import { JsonLogSink } from "./json-log-sink";
import { LogEntry } from "../domain/log-entry";
import { LogLevel } from "../domain/log-level";
import { fi } from "date-fns/locale";

describe("JsonLogSink", () => {
  const testFilePath = "test-log.sink.json";
  const testEntries: LogEntry[] = [
    {
      timestamp: new Date("2023-03-01T00:00:00.000Z").getTime(),
      loglevel: LogLevel.DEBUG,
      transactionId: "1",
      err: null,
    },
    {
      timestamp: new Date("2023-01-15T00:00:00.000Z").getTime(),
      loglevel: LogLevel.ERROR,
      transactionId: "2",
      err: null,
    },
  ];

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    fs.unlinkSync(testFilePath);
  });

  it("should write log entries to a JSON file", async () => {
    const logSink = new JsonLogSink(testFilePath);

    for (const entry of testEntries) {
      logSink.write(entry);
    }

    logSink.close();

    await new Promise((resolve) => setTimeout(resolve, 50));

    const logFileContent = fs.readFileSync(testFilePath, "utf8");
    const logs = JSON.parse(logFileContent);

    expect(logs).toMatchObject(testEntries);
  });
});
