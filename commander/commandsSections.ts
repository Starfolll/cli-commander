import Command, {command} from "./command";
import readlineSync from "readline-sync";
import {execSync} from "child_process";
import chalk from "chalk";


export type commandsSections = {
   name: string;
   sections?: { [name: string]: commandsSections };
   commands?: { [name: string]: command };
   deep?: number;
   header?: string;
   currentDirPath?: string;
   startCommand?: Function;
}

export default class CommandsSections {
   public readonly name: string;
   private readonly deep: number;

   private readonly sections: { [name: string]: CommandsSections };
   private readonly commands: { [name: string]: Command };

   private readonly header?: string;
   protected readonly currentDirPath: string;

   protected line: string = "line";

   public readonly startCommand?: Function;

   constructor(commandsSections: commandsSections) {
      this.name = commandsSections.name;
      this.deep = commandsSections.deep ?? 1;
      this.header = commandsSections.header ?? "";
      this.currentDirPath = commandsSections.currentDirPath || "";

      this.startCommand = commandsSections.startCommand;

      this.sections = {};
      if (!!commandsSections.sections) for (const section in commandsSections.sections)
         this.sections[section] = new CommandsSections(({
            ...commandsSections.sections[section],
            currentDirPath: this.currentDirPath,
            deep: this.deep + 1
         }));

      this.commands = {};
      if (!!commandsSections.commands) for (const command in commandsSections.commands)
         this.commands[command] = new Command(({
            ...commandsSections.commands[command],
            deep: this.deep + 1
         }));
   }

   public ShowTitle(): void {
      console.log(` ${"I".repeat(this.deep)} > ${chalk.underline.blueBright(this.name)} <`);
   }

   public ShowSectionTitle(): void {
      console.log(` ${"I".repeat(this.deep)} ${chalk.blueBright(this.name)}`);
   }

   public Show(): void {
      console.log();
      this.ShowTitle();

      if (Object.keys(this.sections).length > 0) console.log();
      Object.keys(this.sections).forEach(s => this.sections[s].ShowSectionTitle());

      if (Object.keys(this.commands).length > 0) console.log();
      Object.keys(this.commands).forEach(c => this.commands[c].Show());

      console.log();
   }

   public SpawnCommand(commandName: string): void {
      const command = this.commands[commandName];
      if (!command) return console.error(" | No such command");
      else command.Execute();
   }

   public EnterSection(sectionName: string, onSectionQuit: any): void {
      const section = this.sections[sectionName];
      if (!section) return console.error(" | No such section");
      else section.Enter(onSectionQuit);
   }

   private ExecCustomCommand(): void {
      try {
         const input = readlineSync.question(chalk.magentaBright(
            ` Ic${"I".repeat(this.deep)}> `
         ));

         if (!!input) {
            console.log(`> ${input}`);
            console.log();
            execSync(input, {stdio: "inherit"});
            console.log();
         }
      } catch (e) {
         console.log(e);
      }
   }

   public Enter(onSectionQuit: any): void {
      const displaySection = () => {
         console.clear();
         console.log();
         if (!!this.currentDirPath) {
            console.log(` dir : ${this.currentDirPath}`);
            if (!!this.startCommand) console.log();
         }
         if (!!this.startCommand) this.startCommand();
         this.Show();
      };

      displaySection();
      while (true) {
         const input = readlineSync.question(chalk.magenta(
            ` ${"I".repeat(this.deep + 1)}> `
         ));
         if (!input) continue;

         if (input === "q") {
            onSectionQuit();
            break;
         } else if (input === "c") {
            displaySection();
            continue;
         } else if (input === "--") {
            this.ExecCustomCommand();
            continue;
         }

         if (input[0] === "-") this.SpawnCommand(input);
         else this.EnterSection(input, displaySection);
      }
   }
}
