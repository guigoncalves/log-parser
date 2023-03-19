import { LogSource } from "../domain/log-entry";
import fs from "fs";
import readline from "readline";

export class FileLogSource implements LogSource {
  private fileStream: readline.Interface;
  private lineGenerator: AsyncGenerator<string>;

  constructor(filePath: string) {
    const stream = fs.createReadStream(filePath, { encoding: "utf-8" });
    this.fileStream = readline.createInterface({
      input: stream,
      // Set crlfDelay to Infinity to handle any combination of line endings (\r, \n, or \r\n).
      crlfDelay: Infinity,
    });
    this.lineGenerator = this.lineReader();
  }

  private async *lineReader(): AsyncGenerator<string> {
    for await (const line of this.fileStream) {
      yield line;
    }
  }

  async readNextLine(): Promise<string | null> {
    const { value, done } = await this.lineGenerator.next();
    return done ? null : value;
  }
}
