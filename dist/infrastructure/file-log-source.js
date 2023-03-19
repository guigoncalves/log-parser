"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogSource = void 0;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
class FileLogSource {
    constructor(filePath) {
        const stream = fs_1.default.createReadStream(filePath, { encoding: "utf-8" });
        this.fileStream = readline_1.default.createInterface({ input: stream });
    }
    async readLine() {
        return new Promise((resolve) => {
            this.fileStream.once("line", (line) => {
                resolve(line);
            });
            this.fileStream.once("close", () => {
                resolve(null);
            });
        });
    }
}
exports.FileLogSource = FileLogSource;
