"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const cmd_1 = __importDefault(require("./cmd"));
class Command {
    constructor(command) {
        var _a, _b, _c;
        this.name = command.name;
        this.actionDescription = (_a = command.actionDescription, (_a !== null && _a !== void 0 ? _a : ""));
        this.cmd = command.cmd.map(c => new cmd_1.default(c));
        this.deep = (_b = command.deep, (_b !== null && _b !== void 0 ? _b : 1));
        this.printGap = (_c = command.printGap, (_c !== null && _c !== void 0 ? _c : false));
    }
    Show() {
        console.log(` ${"I".repeat(this.deep - 1)} ${(chalk_1.default.greenBright(this.name)).padEnd(60 - this.deep * 2)} ${!!this.actionDescription ? " | " : ""} ${chalk_1.default(this.actionDescription)}`);
        if (this.printGap)
            console.log();
    }
    Execute() {
        for (let i = 0; i < this.cmd.length; i++)
            this.cmd[i].Spawn();
    }
}
exports.default = Command;
