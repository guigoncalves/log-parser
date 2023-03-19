import { LogEntry, LogSink } from "../domain/log-entry";
import fs from "fs";

export class FileLogSink implements LogSink {
  private writeStream: fs.WriteStream;
  private isFirstEntry: boolean = true;

  constructor(filePath: string) {
    this.writeStream = fs.createWriteStream(filePath, { encoding: "utf-8" });
  }

  async write(logEntry: LogEntry): Promise<void> {
    const jsonEntry = JSON.stringify(logEntry);
    if (this.isFirstEntry) {
      this.writeStream.write("[");
      this.isFirstEntry = false;
    } else {
      this.writeStream.write(", \n"); // Add a comma before the entry if it is not the first entry
    }
    this.writeStream.write(jsonEntry);
  }

  public close(): void {
    this.writeStream.end("]");
    this.writeStream.close();
  }
}
