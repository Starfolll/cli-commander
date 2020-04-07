import chalk from "chalk";
import Cmd, {command} from "./command";


export type commandGroup = {
   readonly name: string;
   readonly actionDescription?: string;
   readonly cmd: Array<command>;
   readonly deep?: number;
   readonly printGap?: boolean;
}

export default class Command {
   public readonly name: string;
   public readonly actionDescription: string;

   private readonly cmd: Array<Cmd>;

   private readonly deep: number;
   private readonly printGap: boolean;


   constructor(command: commandGroup) {
      this.name = command.name;
      this.actionDescription = command.actionDescription ?? "";

      this.cmd = command.cmd.map(c => new Cmd(c));

      this.deep = command.deep ?? 1;
      this.printGap = command.printGap ?? false;
   }

   public Show(): void {
      console.log(` ${"I".repeat(this.deep - 1)} ${(chalk.greenBright(this.name)).padEnd(60 - this.deep * 2)} ${!!this.actionDescription ? " | " : ""} ${chalk(this.actionDescription)}`);
      if (this.printGap) console.log();
   }

   public Execute(): void {
      for (let i = 0; i < this.cmd.length; i++)
         this.cmd[i].Spawn();
   }
}
