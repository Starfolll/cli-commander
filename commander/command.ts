import readlineSync from "readline-sync";
import chalk from "chalk";
import {spawn, spawnSync} from "child_process";


export type command = {
   readonly cmd: string;
   readonly cmdParams?: string;
   readonly cmdConfigurableValues?: Array<string>;
   readonly ignoreLogs?: boolean;
}

export default class Cmd {
   private readonly cmd: string;
   private readonly cmdParams: string;
   private readonly cmdConfigurableValues: Array<string>;
   private readonly ignoreLogs: boolean;


   constructor(cmd: command) {
      this.cmd = cmd.cmd;
      this.cmdParams = cmd.cmdParams ?? "";
      this.cmdConfigurableValues = cmd.cmdConfigurableValues ?? [];
      this.ignoreLogs = !!cmd.ignoreLogs;
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
}
