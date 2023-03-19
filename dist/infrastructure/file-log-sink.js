"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileLogSink = void 0;
const fs_1 = __importDefault(require("fs"));
class FileLogSink {
    constructor(filePath) {
        this.writeStream = fs_1.default.createWriteStream(filePath, { encoding: "utf-8" });
    }
    async write(logEntry) {
        const jsonEntry = JSON.stringify(logEntry);
        this.writeStream.write(jsonEntry + "\n");
    }
}
exports.FileLogSink = FileLogSink;
