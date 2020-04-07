"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = __importDefault(require("./commandGroup"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const child_process_1 = require("child_process");
const chalk_1 = __importDefault(require("chalk"));
const commander_1 = require("../commander");
class CommandsSections {
    constructor(commandsSections) {
        var _a, _b, _c, _d;
        this.name = commandsSections.name;
        this.deep = (_a = commandsSections.deep, (_a !== null && _a !== void 0 ? _a : 1));
        this.header = (_b = commandsSections.header, (_b !== null && _b !== void 0 ? _b : ""));
        this.currentDirPath = (_c = commandsSections.currentDirPath, (_c !== null && _c !== void 0 ? _c : ""));
        this.startCommand = commandsSections.startCommand;
        this.saveFunction = (_d = commandsSections.saveFunction, (_d !== null && _d !== void 0 ? _d : (() => commander_1.saveCommandsFile(this.GetDataToSave()))));
        this.sections = {};
        if (!!commandsSections.sections)
            for (const section in commandsSections.sections)
                this.sections[section] = new CommandsSections((Object.assign(Object.assign({}, commandsSections.sections[section]), { currentDirPath: this.currentDirPath, saveFunction: this.saveFunction, deep: this.deep + 1 })));
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
            const input = readline_sync_1.default.question(` ${this.currentDirPath} : `);
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
    CreateSection() {
        const newSectionName = readline_sync_1.default.question(" New section name : ");
        const sectionExists = !!this.sections[newSectionName];
        if (sectionExists) {
            console.log(" Can not create section (name is reserved) \n");
            return false;
        }
        else {
            this.sections[newSectionName] = new CommandsSections({
                name: newSectionName,
                deep: this.deep + 1,
                currentDirPath: this.currentDirPath,
                startCommand: this.startCommand,
                saveFunction: this.saveFunction
            });
            this.saveFunction();
            return true;
        }
    }
    DeleteSection() {
        const sectionToDelete = readline_sync_1.default.question(" Section to delete : ");
        const sectionExists = !!this.sections[sectionToDelete];
        if (!sectionExists) {
            console.log(` No section with name ${sectionToDelete} \n`);
            return false;
        }
        else if (commander_1.isReplyPositive(readline_sync_1.default.question(` Are you sure you want to delete ${sectionToDelete} section? \n [yes/no] : `))) {
            delete this.sections[sectionToDelete];
            this.saveFunction();
            return true;
        }
        return false;
    }
    CheckForCommandName() {
        return true;
    }
    CreateCommand() {
        return false;
    }
    DeleteCommand() {
        return false;
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
            const input = readline_sync_1.default.question(chalk_1.default.magenta(` ${"=".repeat(this.deep + 1)}> `));
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
            else if (input === "cli-cc") {
                if (this.CreateCommand())
                    displaySection();
                continue;
            }
            else if (input === "cli-cs") {
                if (this.CreateSection())
                    displaySection();
                continue;
            }
            else if (input === "cli-dc") {
                if (this.DeleteCommand())
                    displaySection();
                continue;
            }
            else if (input === "cli-ds") {
                if (this.DeleteSection())
                    displaySection();
                continue;
            }
            if (input[0] === "-")
                this.SpawnCommand(input);
            else
                this.EnterSection(input, displaySection);
        }
    }
    GetDataToSave() {
        const sectionsName = Object.keys(this.sections);
        const sectionsData = {};
        sectionsName.forEach(sN => sectionsData[sN] = this.sections[sN].GetDataToSave());
        return {
            name: this.name,
            header: this.header,
            currentDirPath: this.deep === 1 ? this.currentDirPath : undefined,
            sections: sectionsData,
            commands: {},
        };
    }
}
exports.default = CommandsSections;
