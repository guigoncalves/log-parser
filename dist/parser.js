"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const log_parser_1 = require("./adapters/log-parser");
const file_log_source_1 = require("./infrastructure/file-log-source");
const file_log_sink_1 = require("./infrastructure/file-log-sink");
const yargs_1 = __importDefault(require("yargs"));
const argv = yargs_1.default
    .options({
    input: {
        type: "string",
        demandOption: true,
        alias: "i",
        description: "Path to the input log file",
    },
    output: {
        type: "string",
        demandOption: true,
        alias: "o",
        description: "Path to the output file for error logs",
    },
})
    .help()
    .alias("help", "h")
    .parseSync();
// Instantiate the LogSource and LogSink implementations
const logSource = new file_log_source_1.FileLogSource(argv.input);
const logSink = new file_log_sink_1.FileLogSink(argv.output);
// Instantiate the LogParser with the LogSource and LogSink dependencies
const parser = new log_parser_1.LogParser(logSource, logSink);
// Execute the log parser
(async () => {
    await parser.parse();
})();
