import readlineSync from "readline-sync";
import chalk from "chalk";
import {spawnSync, spawn} from "child_process";


export type cmd = {
   readonly cmd: string;
   readonly cmdParams?: Array<string>;
   readonly cmdConfigurableValues?: Array<string>;
   readonly ignoreLogs?: boolean;
}

export default class Cmd {
   private readonly cmd: string;
   private readonly cmdParams: Array<string>;
   private readonly cmdConfigurableValues: Array<string>;
   private readonly ignoreLogs: boolean;


   constructor(cmd: cmd) {
      this.cmd = cmd.cmd;
      this.cmdParams = cmd.cmdParams ?? [];
      this.cmdConfigurableValues = cmd.cmdConfigurableValues ?? [];
      this.ignoreLogs = !!cmd.ignoreLogs;
   }


   Spawn() {
      let params = [...this.cmdParams];

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