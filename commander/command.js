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
        var _a, _b;
        this.cmd = command.cmd;
        this.cmdParams = (_a = command.cmdParams, (_a !== null && _a !== void 0 ? _a : ""));
        this.cmdConfigurableValues = (_b = command.cmdConfigurableValues, (_b !== null && _b !== void 0 ? _b : []));
        this.ignoreLogs = !!command.ignoreLogs;
    }
    Spawn() {
        let params = this.cmdParams.split(" ");
        for (const confName of this.cmdConfigurableValues) {
            const replacer = (readline_sync_1.default.question(`> Input ${chalk_1.default.blueBright(confName)} > `)).split(" ").join("_");
            params = params.map(i => confName === i ? replacer : i);
        }
        console.log(`> ${this.cmd} ${[...params].join(" ")}`);
        console.log();
        if (!this.ignoreLogs)
            child_process_1.spawnSync(this.cmd, [...params], {
                stdio: this.ignoreLogs ? "ignore" : "inherit"
            });
        else
            child_process_1.spawn(this.cmd, [...params], {
                stdio: this.ignoreLogs ? "ignore" : "inherit"
            });
    }
    GetDataToSave() {
        return {
            cmd: this.cmd,
            cmdConfigurableValues: this.cmdConfigurableValues.length > 1 ? this.cmdConfigurableValues : undefined,
            cmdParams: this.cmdParams,
            ignoreLogs: this.ignoreLogs
        };
    }
}
exports.default = Command;
