import { LogEntry, LogSink } from "../domain/log-entry";
import fs from "fs";

export class JsonLogSink {
  private stream: fs.WriteStream;
  private isFirstEntry: boolean = true;

  constructor(filePath: string) {
    this.stream = fs.createWriteStream(filePath, {
      encoding: "utf-8",
    });
  }

  write(entry: LogEntry): void {
    const jsonEntry = JSON.stringify(entry);
    if (this.isFirstEntry) {
      this.stream.write(`[${jsonEntry}`);
      this.isFirstEntry = false;
    } else {
      this.stream.write(`,${jsonEntry}`);
    }
  }

  close(): void {
    if (!this.isFirstEntry) {
      this.stream.write("]");
    }
    this.stream.end();
  }
}
