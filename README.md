# Log Parser

A command line Node.js application to parse log files and extract log messages based on their log level. The extracted log messages are then saved in a JSON format to a specified output file.

## Requirements

- Node.js v18+

## Installation

1. Clone the repository

```bash
git clone http://berbob-gmbh-zmekib@git.codesubmit.io/berbob-gmbh/nodejs-logger-zircgk
```

2. Change to the project directory

```bash
cd log-parser
```

3. Install dependencies

```bash
npm install

```

4. Compile js

This command will generate the js files under the `dist` folder

```bash
npm run build
```

## Usage

To parse a log file and extract messages with a specific log level, run the following command:

```bash
node dist/parser.js --input ./path/to/input.log --output ./path/to/output.json --logLevel minimumLogLevel
```

Replace ./path/to/input.log with the path to your input log file and ./path/to/output.json with the path to the desired output JSON file. Replace error with the desired log level you want to extract. Available log levels are error, warn, info, and debug.

```bash
node  dist/parser.js --input ./log-files/app.log --output ./log-files/output.json --logLevel error
```

## Tests

To run unit/integration tests

```bash
npm run test
```

To run e2e tests

```bash
npm run test:e2e
```

## Input Format

```bash
<ISO Date> - <Log Level> - {"transactionId: "<UUID>", "details": "<message event/action description>", "err": "<Optional, error description>", ...<additional log information>}
```

## Output Format

The extracted log entries are saved in a JSON format:

```json
[
  {
    "timestamp": <Epoch Unix Timestamp>,
    "loglevel": "<loglevel>",
    "transactionId": "<UUID>",
    "err": "<Error message>"
  }
]
```
