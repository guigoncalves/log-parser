import { spawn } from "child_process";
import fs from "fs";
import { JsonLogSink } from "../src/connectors/json-log-sink";
import { StreamLogSource } from "../src/connectors/stream-log-source";
import { LogLevel } from "../src/domain/log-level";

describe("CLI", () => {
  const inputFilePath = "test-input.log";
  const outputFilePath = "test-output.json";
  const inputLogLines = [
    `2044-08-09T02:12:51.253Z - info - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"Service is started"}`,
    `2021-08-09T02:12:51.254Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request the user information","userId": 10}`,
    `2021-08-09T02:12:51.254Z - debug - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e978","details":"About to request user orders list","userId": 10}`,
    `2021-08-09T02:12:51.255Z - error - {"transactionId":"9abc55b2-807b-4361-9dbe-aa88b1b2e821","details":"Service is started"}`,
  ];
  const testEntries = [
    {
      timestamp: new Date("2021-08-09T02:12:51.255Z").getTime(),
      loglevel: LogLevel.ERROR,
      transactionId: "9abc55b2-807b-4361-9dbe-aa88b1b2e821",
      err: null,
    },
  ];

  beforeAll(() => {
    const stream = fs.createWriteStream(inputFilePath, { flags: "a" });
    for (const line of inputLogLines) {
      stream.write(`${line}\n`);
    }
    stream.end();
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 100));
    [inputFilePath, outputFilePath].forEach((path) => {
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    });
  });

  it("should parse input log file and generate output JSON file", (done) => {
    const cliProcess = spawn("node", [
      "dist/parser.js",
      "--input",
      inputFilePath,
      "--output",
      outputFilePath,
      "--logLevel",
      "error",
    ]);

    cliProcess.on("close", () => {
      const logFileContent = fs.readFileSync(outputFilePath, "utf8");
      const logs = JSON.parse(logFileContent);
      expect(logs).toMatchObject(testEntries);
      done();
    });
  });
});
