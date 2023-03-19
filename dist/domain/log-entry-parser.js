"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogEntryParser = void 0;
const date_fns_1 = require("date-fns");
class LogEntryParser {
    static parseLine(line) {
        const regex = /(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z) - (\w+) - (.+)/;
        const match = line.match(regex);
        if (!match)
            return null;
        const [, date, loglevel, json] = match;
        const parsedJson = JSON.parse(json);
        const timestamp = (0, date_fns_1.getTime)((0, date_fns_1.parseISO)(date));
        return {
            timestamp,
            loglevel,
            transactionId: parsedJson.transactionId,
            err: parsedJson.err || null,
        };
    }
}
exports.LogEntryParser = LogEntryParser;
