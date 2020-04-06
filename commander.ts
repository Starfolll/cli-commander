import CommandsSections from "./commander/commandsSections";
import fs from "fs";

const commandsFileDir = process.cwd() + "/commands.js";
if (fs.existsSync(commandsFileDir)) {
   const commands = require(commandsFileDir);
   const commandsSections = new CommandsSections(commands);

   commandsSections.Enter(() => {
      console.clear();
      console.log(" bye ");
   });
} else console.log(` !!! Can not find ${commandsFileDir} file`);
