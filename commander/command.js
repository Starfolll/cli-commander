"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const readline_sync_1 = __importDefault(require("readline-sync"));
const chalk_1 = __importDefault(require("chalk"));
const child_process_1 = require("child_process");
class Command {
    constructor(command) {
        this.cmd = command.cmd;
        this.cmdParams = command.cmdParams;
        this.cmdConfigurableValues = command.cmdConfigurableValues;
        this.ignoreLogs = !!command.ignoreLogs;
        this.dir = command.dir;
    }
    Spawn() {
        let params = this.cmdParams ? this.cmdParams.split(" ") : undefined;
        if (!!params && !!this.cmdConfigurableValues)
            for (const confName of this.cmdConfigurableValues) {
                const replacer = (readline_sync_1.default.question(`> Input ${chalk_1.default.blueBright(confName)} > `)).split(" ").join("_");
                params = params.map(i => confName === i ? replacer : i);
            }
        console.log(`> ${this.cmd} ${!!params ? [...params].join(" ") : ""}`);
        console.log();
        const execDir = `${process.cwd()}/`;
        if (!this.ignoreLogs)
            try {
                child_process_1.execSync(`${this.cmd} ${!!params ? [...params].join(" ") : ""}`, {
                    stdio: this.ignoreLogs ? "ignore" : "inherit",
                });
            }
            catch (e) {
                console.log(chalk_1.default.redBright(" Error !"));
            }
        else
            try {
                child_process_1.exec(`${this.cmd} ${!!params ? [...params].join(" ") : ""}`, { cwd: execDir });
            }
            catch (e) {
                console.log(chalk_1.default.redBright(" Error !"));
            }
    }
    GetDataToSave() {
        return {
            cmd: this.cmd,
            cmdConfigurableValues: this.cmdConfigurableValues,
            cmdParams: this.cmdParams,
            ignoreLogs: this.ignoreLogs
        };
    }
}
exports.default = Command;
