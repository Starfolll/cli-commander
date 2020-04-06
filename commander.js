"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandsSections_1 = __importDefault(require("./commander/commandsSections"));
const fs_1 = __importDefault(require("fs"));
const commandsFileDir = process.cwd() + "/commands.js";
if (fs_1.default.existsSync(commandsFileDir)) {
    const commands = require(commandsFileDir);
    const commandsSections = new commandsSections_1.default(commands);
    commandsSections.Enter(() => {
        console.clear();
        console.log(" bye ");
    });
}
else
    console.log(` !!! Can not find ${commandsFileDir} file`);
