"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const command_1 = __importDefault(require("./command"));
class CommandsGroup {
    constructor(command) {
        var _a, _b, _c;
        this.name = command.name;
        this.actionDescription = (_a = command.actionDescription, (_a !== null && _a !== void 0 ? _a : ""));
        this.cmd = command.cmd.map(c => new command_1.default(c));
        this.deep = (_b = command.deep, (_b !== null && _b !== void 0 ? _b : 1));
        this.printGap = (_c = command.printGap, (_c !== null && _c !== void 0 ? _c : false));
    }
    static ShowCommand(params) {
        console.log(` ${"I".repeat(params.deep - 1)} ${(chalk_1.default.greenBright(params.name)).padEnd(60 - params.deep * 2)} ${!!params.actionDescription ? " | " : ""} ${chalk_1.default(params.actionDescription)}`);
    }
    Show() {
        CommandsGroup.ShowCommand({
            deep: this.deep,
            name: this.name,
            actionDescription: this.actionDescription
        });
        if (this.printGap)
            console.log();
    }
    Execute() {
        for (let i = 0; i < this.cmd.length; i++)
            this.cmd[i].Spawn();
    }
    GetDataToSave() {
        return {
            actionDescription: this.actionDescription,
            cmd: this.cmd.map(c => c.GetDataToSave()),
            name: this.name
        };
    }
}
exports.default = CommandsGroup;