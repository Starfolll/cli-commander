import readlineSync from "readline-sync";
import chalk from "chalk";
import {spawn, spawnSync} from "child_process";


export type command = {
   readonly cmd: string;
   readonly cmdParams?: string;
   readonly cmdConfigurableValues?: Array<string>;
   readonly ignoreLogs?: boolean;
}

export default class Command {
   private readonly cmd: string;
   private readonly cmdParams: string;
   private readonly cmdConfigurableValues: Array<string>;
   private readonly ignoreLogs: boolean;


   constructor(command: command) {
      this.cmd = command.cmd;
      this.cmdParams = command.cmdParams ?? "";
      this.cmdConfigurableValues = command.cmdConfigurableValues ?? [];
      this.ignoreLogs = !!command.ignoreLogs;
   }


   Spawn() {
      let params = this.cmdParams.split(" ");

      for (const confName of this.cmdConfigurableValues) {
         const replacer = (readlineSync.question(`> Input ${chalk.blueBright(confName)} > `)).split(" ").join("_");

         params = params.map(i => confName === i ? replacer : i);
      }

      console.log(`> ${this.cmd} ${[...params].join(" ")}`);
      console.log();

      if (!this.ignoreLogs) spawnSync(this.cmd, [...params], {
         stdio: this.ignoreLogs ? "ignore" : "inherit"
      });
      else spawn(this.cmd, [...params], {
         stdio: this.ignoreLogs ? "ignore" : "inherit"
      });
   }


   GetDataToSave(): command {
      return {
         cmd: this.cmd,
         cmdConfigurableValues: this.cmdConfigurableValues.length > 1 ? this.cmdConfigurableValues : undefined,
         cmdParams: this.cmdParams,
         ignoreLogs: this.ignoreLogs
      }
   }
}
