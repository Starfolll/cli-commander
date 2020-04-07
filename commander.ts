import CommandsSections, {commandsSections} from "./commander/commandsSections";
import fileData from "./commander/commandsSetupFile";
import readlineSync from "readline-sync";
import chalk from "chalk";
import fs from "fs";


const initDir = process.cwd();
const commandsFileDir = initDir + "/commands.js";


export const isReplyPositive = (reply: string): boolean => ["yes", "ye", "y"].some(s => reply.toLowerCase() === s);
export const createCommanderFile = () => {
   fs.writeFileSync(commandsFileDir, fileData(readlineSync.question(" Project name : ")));
   console.log(" Commands file created!");
};
export const saveCommandsFile = (commandsSections: commandsSections) => {
   fs.writeFileSync(
      initDir + "/commands.js",
      `module.exports = ${JSON.stringify(commandsSections, null, 3)};`
   );
};


if (fs.existsSync(commandsFileDir)) {
   const commands = require(commandsFileDir);
   const commandsSections = new CommandsSections(commands);

   commandsSections.Enter(() => {
      console.clear();
      console.log(" bye ");
   });
} else {
   console.log();
   console.log(chalk.redBright(` ${commandsFileDir} file not found!`));
   console.log();

   const createCommandsFileReply =
      readlineSync.question(` Do u want create commands file in ${chalk.blueBright(initDir)}? \n [yes/no] : `);
   if (isReplyPositive(createCommandsFileReply)) createCommanderFile();

   console.log();
}
