"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogParser = void 0;
const log_entry_parser_1 = require("../domain/log-entry-parser");
class LogParser {
    constructor(logSource, logSink) {
        this.logSource = logSource;
        this.logSink = logSink;
    }
    async parse() {
        let line;
        while ((line = await this.logSource.readLine()) !== null) {
            console.log("Reading line");
            console.log(line);
            const logEntry = log_entry_parser_1.LogEntryParser.parseLine(line);
            if (logEntry && logEntry.loglevel === "error") {
                await this.logSink.write(logEntry);
            }
        }
    }
}
exports.LogParser = LogParser;
