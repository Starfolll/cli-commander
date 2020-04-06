"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("./command"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
class CommandsSections {
    constructor(commandsSections) {
        var _a, _b;
        this.line = "line";
        this.name = commandsSections.name;
        this.deep = (_a = commandsSections.deep, (_a !== null && _a !== void 0 ? _a : 1));
        this.header = (_b = commandsSections.header, (_b !== null && _b !== void 0 ? _b : ""));
        this.currentDirPath = commandsSections.currentDirPath || "";
        this.startCommand = commandsSections.startCommand;
        this.sections = {};
        if (!!commandsSections.sections)
            for (const section in commandsSections.sections)
                this.sections[section] = new CommandsSections((Object.assign(Object.assign({}, commandsSections.sections[section]), { currentDirPath: this.currentDirPath, deep: this.deep + 1 })));
        this.commands = {};
        if (!!commandsSections.commands)
            for (const command in commandsSections.commands)
                this.commands[command] = new command_1.default((Object.assign(Object.assign({}, commandsSections.commands[command]), { deep: this.deep + 1 })));
    }
    ShowTitle() {
        console.log(` ${"I".repeat(this.deep)} > ${chalk_1.default.underline.blueBright(this.name)} <`);
    }
    ShowSectionTitle() {
        console.log(` ${"I".repeat(this.deep)} ${chalk_1.default.blueBright(this.name)}`);
    }
    Show() {
        console.log();
        this.ShowTitle();
        if (Object.keys(this.sections).length > 0)
            console.log();
        Object.keys(this.sections).forEach(s => this.sections[s].ShowSectionTitle());
        if (Object.keys(this.commands).length > 0)
            console.log();
        Object.keys(this.commands).forEach(c => this.commands[c].Show());
        console.log();
    }
    SpawnCommand(commandName) {
        const command = this.commands[commandName];
        if (!command)
            return console.error(" | No such command");
        else
            command.Execute();
    }
    EnterSection(sectionName, onSectionQuit) {
        const section = this.sections[sectionName];
        if (!section)
            return console.error(" | No such section");
        else
            section.Enter(onSectionQuit);
    }
    ExecCustomCommand() {
        try {
            const input = readline_sync_1.default.question(chalk_1.default.magentaBright(` Ic${"I".repeat(this.deep)}> `));
            if (!!input) {
                console.log(`> ${input}`);
                console.log();
                child_process_1.execSync(input, { stdio: "inherit" });
                console.log();
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    Enter(onSectionQuit) {
        const displaySection = () => {
            console.clear();
            console.log();
            if (!!this.currentDirPath) {
                console.log(` dir : ${this.currentDirPath}`);
                if (!!this.startCommand)
                    console.log();
            }
            if (!!this.startCommand)
                this.startCommand();
            this.Show();
        };
        displaySection();
        while (true) {
            const input = readline_sync_1.default.question(chalk_1.default.magenta(` ${"I".repeat(this.deep + 1)}> `));
            if (!input)
                continue;
            if (input === "q") {
                onSectionQuit();
                break;
            }
            else if (input === "c") {
                displaySection();
                continue;
            }
            else if (input === "--") {
                this.ExecCustomCommand();
                continue;
            }
            if (input[0] === "-")
                this.SpawnCommand(input);
            else
                this.EnterSection(input, displaySection);
        }
    }
}
exports.default = CommandsSections;
