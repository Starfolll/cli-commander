import CommandsSections, {commandsSections} from "./commander/commandsSections";
import GetYamlSetupFile from "./commander/commandsSetupFile";
import readlineSync from "readline-sync";
import chalk from "chalk";
import fs from "fs";
import yaml from "yaml";


const initDir = process.cwd();
const commandsFileDir = initDir + "/commands.yml";


export const isReplyPositive = (reply: string): boolean => ["yes", "ye", "y"].some(s => reply.toLowerCase() === s);
export const createCommanderFile = () => {
   fs.writeFileSync(commandsFileDir, GetYamlSetupFile(readlineSync.question(" Project name : ")));
   console.log(" Commands file created!");
};
export const saveCommandsFile = (commandsSections: commandsSections) => {
   fs.writeFileSync(
      commandsFileDir,
      yaml.stringify(commandsSections)
      // `module.exports = ${JSON.stringify(commandsSections, null, 3)};`
   );
};


if (fs.existsSync(commandsFileDir)) {
   const commandsSections = new CommandsSections(yaml.parse(fs.readFileSync(commandsFileDir).toString()));

   commandsSections.Enter(() => {
      saveCommandsFile(commandsSections.GetDataToSave());
      console.clear();
   });
} else {
   console.log();
   console.log(chalk.redBright(` ${commandsFileDir} file is not found!`));
   console.log();

   const createCommandsFileReply =
      readlineSync.question(` Do u want create commands file in ${chalk.blueBright(initDir)}? \n [yes/no] : `);
   if (isReplyPositive(createCommandsFileReply)) createCommanderFile();

   console.log();
}
