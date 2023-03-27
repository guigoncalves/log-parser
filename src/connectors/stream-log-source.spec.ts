import { StreamLogSource } from "./stream-log-source";
import fs from "fs";

describe("StreamLogSource", () => {
  const filePath = "test.log";
  const lines = ["line 1", "line 2", "line 3"];

  beforeEach(() => {
    fs.writeFileSync(filePath, lines.join("\n"));
  });

  afterEach(async () => {
    await new Promise((resolve) => setTimeout(resolve, 50));
    fs.unlinkSync(filePath);
  });

  it("reads lines from a file", async () => {
    const logSource = new StreamLogSource(filePath);
    const readLines: string[] = [];

    let line: string | null = null;
    while ((line = await logSource.readNextLine())) {
      readLines.push(line);
    }

    expect(readLines).toEqual(lines);
  });

  it("returns null when all lines are read", async () => {
    const logSource = new StreamLogSource(filePath);

    let line: string | null = null;
    while ((line = await logSource.readNextLine())) {}

    expect(await logSource.readNextLine()).toBeNull();
  });
});
