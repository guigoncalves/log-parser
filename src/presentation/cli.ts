import yargs from "yargs";
import { LogParser } from "../domain/log-parser";
import { StreamLogSource } from "../connectors/stream-log-source";
import { JsonLogSink } from "../connectors/json-log-sink";
import { LogLevel } from "../domain/log-level";

interface Arguments {
  input: string;
  output: string;
  logLevel: string;
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
    logLevel: {
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
const logSource = new StreamLogSource(argv.input);
const logSink = new JsonLogSink(argv.output);

const logLevelEnum: LogLevel = argv.logLevel.toLowerCase() as LogLevel;
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
