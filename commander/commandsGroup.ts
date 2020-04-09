import chalk from "chalk";
import Command, {command} from "./command";


export type commandsGroup = {
   readonly name: string;
   readonly actionDescription?: string;
   readonly cmd: Array<command>;
   readonly deep?: number;
   readonly printGap?: boolean;
}

export default class CommandsGroup {
   public readonly name: string;
   public readonly actionDescription: string;

   private readonly cmd: Array<Command>;

   private readonly deep: number;
   private readonly printGap: boolean;


   constructor(command: commandsGroup) {
      this.name = command.name;
      this.actionDescription = command.actionDescription ?? "";

      this.cmd = command.cmd.map(c => new Command(c));

      this.deep = command.deep ?? 1;
      this.printGap = command.printGap ?? false;
   }


   public static ShowCommand(params: { deep: number, actionDescription: string, name: string }): void {
      const deep = params.deep - 1 < 0 ? 0 : params.deep;
      console.log(` ${("I".repeat(deep) + " " + chalk.greenBright(params.name)).padEnd(60)} ${!!params.actionDescription ? " | " : ""} ${chalk(params.actionDescription)}`);
   }


   public Show(): void {
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: this.name,
         actionDescription: this.actionDescription
      });
      if (this.printGap) console.log();
   }

   public Execute(): void {
      for (let i = 0; i < this.cmd.length; i++)
         this.cmd[i].Spawn();
   }


   public GetDataToSave(): commandsGroup {
      return {
         actionDescription: this.actionDescription,
         cmd: this.cmd.map(c => c.GetDataToSave()),
         name: this.name
      }
   }
}
