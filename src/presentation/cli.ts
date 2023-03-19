import yargs from "yargs";
import { LogParser } from "../domain/log-parser";
import { FileLogSource } from "../connectors/stream-file-log-source";
import { FileLogSink } from "../connectors/stream-file-log-sink";
import { LogLevel } from "../domain/log-level";

interface Arguments {
  input: string;
  output: string;
  minLogLevel: string;
}

const argv = yargs
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
    minLogLevel: {
      type: "string",
      default: "error",
      alias: "ll",
      description: "Minimum log level to parse",
    },
  })
  .help()
  .alias("help", "h")
  .parseSync() as Arguments;

// Instantiate the LogSource and LogSink implementations
const logSource = new FileLogSource(argv.input);
const logSink = new FileLogSink(argv.output);

const logLevelEnum: LogLevel = argv.minLogLevel.toLowerCase() as LogLevel;
if (!Object.values(LogLevel).includes(logLevelEnum)) {
  console.error(
    `minLogLevel not permitted, allowed options ["${Object.values(
      LogLevel
    ).toString()}"]`
  );
  process.exit();
}

// Instantiate the LogParser with the LogSource and LogSink dependencies
const parser = new LogParser(logSource, logSink, logLevelEnum);

// Start the log parser
export const start = () => {
  console.log("Starting parsing...");
  parser.parse().then(() => console.log("Parsing complete."));
};
