import readlineSync from "readline-sync";
import chalk from "chalk";
import {exec, execSync} from "child_process";


export type command = {
   readonly cmd: string;
   readonly cmdParams?: string;
   readonly cmdConfigurableValues?: Array<string>;
   readonly ignoreLogs?: boolean;
   readonly dir?: string;
}

export default class Command {
   private readonly cmd: string;
   private readonly cmdParams?: string;
   private readonly cmdConfigurableValues?: Array<string>;
   private readonly ignoreLogs: boolean;
   private readonly dir: string;


   constructor(command: command) {
      this.cmd = command.cmd;
      this.cmdParams = command.cmdParams;
      this.cmdConfigurableValues = command.cmdConfigurableValues;
      this.ignoreLogs = !!command.ignoreLogs;
      this.dir = command.dir!;
   }


   Spawn() {
      let params = this.cmdParams ? this.cmdParams.split(" ") : undefined;

      if (!!params && !!this.cmdConfigurableValues)
         for (const confName of this.cmdConfigurableValues) {
            const replacer = (readlineSync.question(`> Input ${chalk.blueBright(confName)} > `)).split(" ").join("_");
            params = params.map(i => confName === i ? replacer : i);
         }

      console.log(`> ${this.cmd} ${!!params ? [...params].join(" ") : ""}`);
      console.log();

      const execDir = `${process.cwd()}/`;
      if (!this.ignoreLogs) try {
         execSync(`${this.cmd} ${!!params ? [...params].join(" ") : ""}`, {
            stdio: this.ignoreLogs ? "ignore" : "inherit",
         });
      } catch (e) {
         console.log(chalk.redBright(" Error !"));
      }
      else try {
         exec(`${this.cmd} ${!!params ? [...params].join(" ") : ""}`, {cwd: execDir});
      } catch (e) {
         console.log(chalk.redBright(" Error !"));
      }
   }


   GetDataToSave(): command {
      return {
         cmd: this.cmd,
         cmdConfigurableValues: this.cmdConfigurableValues,
         cmdParams: this.cmdParams,
         ignoreLogs: this.ignoreLogs
      }
   }
}
