"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandsGroup_1 = __importDefault(require("./commandsGroup"));
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
                this.commands[command] = new commandsGroup_1.default((Object.assign(Object.assign({}, commandsSections.commands[command]), { deep: this.deep + 1 })));
    }
    ShowTitle() {
        console.log(` ${"I".repeat(this.deep)} > ${chalk_1.default.underline.blueBright(this.name)} <`);
    }
    ShowSectionTitle() {
        console.log(` ${"I".repeat(this.deep)} ${chalk_1.default.blueBright(this.name)}`);
    }
    ShowDefaultCommands() {
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "c",
            actionDescription: "clear"
        });
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "q",
            actionDescription: "quit section / app"
        });
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "--",
            actionDescription: "run console command"
        });
        console.log();
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "cli-cs",
            actionDescription: "create commands section"
        });
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "cli-ds",
            actionDescription: "delete commands section"
        });
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "cli-cc",
            actionDescription: "create command in current section"
        });
        commandsGroup_1.default.ShowCommand({
            deep: this.deep,
            name: "cli-dc",
            actionDescription: "delete command in current section"
        });
    }
    Show() {
        console.log();
        console.log(this.header);
        console.log();
        if (!!this.currentDirPath) {
            console.log(` dir : ${this.currentDirPath}`);
            if (!!this.startCommand)
                console.log();
        }
        if (!!this.startCommand)
            this.startCommand();
        console.log();
        this.ShowTitle();
        if (this.deep === 1) {
            console.log();
            this.ShowDefaultCommands();
        }
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
            return console.error(" No such command");
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
    CreateCommand() {
        const newCommandName = readline_sync_1.default.question(" New command name : ");
        const commandExists = !!this.sections[newCommandName];
        if (commandExists) {
            console.log(" Can not create command (name is reserved) \n");
            return false;
        }
        else {
            const commandDescription = readline_sync_1.default.question(" CommandDescription : ");
            let commandsCount = readline_sync_1.default.question(" Commands count (default - 1) : ");
            if (+commandsCount > 0)
                commandsCount = +commandsCount;
            else
                commandsCount = 1;
            const commands = [];
            for (let i = 0; i < commandsCount; i++) {
                console.log(` Command ${i + 1} : \n`);
                const cmd = readline_sync_1.default.question(" Command name (for example 'git' not 'git commit') : ");
                const cmdParams = readline_sync_1.default.question(" Command params (for example 'commit') : ");
                const cmdConfigurableValues = readline_sync_1.default.question(" Command configurable values : ").split(" ");
                const ignoreLogs = commander_1.isReplyPositive(readline_sync_1.default.question(" Ignore logs [yes/no] : "));
                commands.push({
                    cmd,
                    cmdParams: !!cmdParams ? cmdParams : undefined,
                    cmdConfigurableValues: cmdConfigurableValues.some(s => !!s) ? cmdConfigurableValues : undefined,
                    ignoreLogs: ignoreLogs ? ignoreLogs : undefined
                });
            }
            this.commands["-" + newCommandName] = new commandsGroup_1.default({
                name: newCommandName,
                actionDescription: (commandDescription !== null && commandDescription !== void 0 ? commandDescription : undefined),
                cmd: commands,
                deep: this.deep + 1
            });
            this.saveFunction();
            return true;
        }
    }
    DeleteCommand() {
        const commandToDelete = readline_sync_1.default.question(" Command to delete : ");
        const commandExists = !!this.sections[commandToDelete];
        if (!commandExists) {
            console.log(` No command with name ${commandToDelete} \n`);
            return false;
        }
        else if (commander_1.isReplyPositive(readline_sync_1.default.question(` Are you sure you want to delete ${commandToDelete} command? \n [yes/no] : `))) {
            delete this.commands[commandToDelete];
            this.saveFunction();
            return true;
        }
        return false;
    }
    Enter(onSectionQuit) {
        const displaySection = () => {
            console.clear();
            this.Show();
        };
        displaySection();
        while (true) {
            const input = readline_sync_1.default.question(chalk_1.default.magenta(` ${"=".repeat(this.deep)}> `));
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
        const commandsName = Object.keys(this.commands);
        const commandsData = {};
        commandsName.forEach(sN => commandsData[sN] = this.commands[sN].GetDataToSave());
        return {
            name: this.name,
            header: this.header,
            currentDirPath: this.deep === 1 ? this.currentDirPath : undefined,
            sections: sectionsData,
            commands: commandsData,
        };
    }
}
exports.default = CommandsSections;
