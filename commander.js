"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commandsSections_1 = __importDefault(require("./commander/commandsSections"));
const commandsSetupFile_1 = __importDefault(require("./commander/commandsSetupFile"));
const readline_sync_1 = __importDefault(require("readline-sync"));
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
const initDir = process.cwd();
const commandsFileDir = initDir + "/commands.yml";
exports.isReplyPositive = (reply) => ["yes", "ye", "y"].some(s => reply.toLowerCase() === s);
exports.createCommanderFile = () => {
    fs_1.default.writeFileSync(commandsFileDir, commandsSetupFile_1.default(readline_sync_1.default.question(" Project name : ")));
    console.log(" Commands file created!");
};
exports.saveCommandsFile = (commandsSections) => {
    fs_1.default.writeFileSync(commandsFileDir, yaml_1.default.stringify(commandsSections));
};
if (fs_1.default.existsSync(commandsFileDir)) {
    const commandsSections = new commandsSections_1.default(yaml_1.default.parse(fs_1.default.readFileSync(commandsFileDir).toString()));
    commandsSections.Enter(() => {
        exports.saveCommandsFile(commandsSections.GetDataToSave());
        console.clear();
    });
}
else {
    console.log();
    console.log(chalk_1.default.redBright(` ${commandsFileDir} file is not found!`));
    console.log();
    const createCommandsFileReply = readline_sync_1.default.question(` Do u want create commands file in ${chalk_1.default.blueBright(initDir)}? \n [yes/no] : `);
    if (exports.isReplyPositive(createCommandsFileReply))
        exports.createCommanderFile();
    console.log();
}
