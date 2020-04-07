import Command, {commandGroup} from "./commandGroup";
import readlineSync from "readline-sync";
import {execSync} from "child_process";
import chalk from "chalk";
import {isReplyPositive, saveCommandsFile} from "../commander";


export type commandsSections = {
   name: string;
   deep?: number;
   sections?: { [name: string]: commandsSections };
   commands?: { [name: string]: commandGroup };
   header?: string;
   currentDirPath?: string;
   startCommand?: Function;
   saveFunction?: Function;
}

export default class CommandsSections {
   public readonly name: string;
   public readonly deep: number;

   public readonly sections: { [name: string]: CommandsSections };
   public readonly commands: { [name: string]: Command };

   public readonly header?: string;
   public readonly currentDirPath: string;

   public readonly startCommand?: Function;
   public readonly saveFunction?: Function;


   constructor(commandsSections: commandsSections) {
      this.name = commandsSections.name;
      this.deep = commandsSections.deep ?? 1;
      this.header = commandsSections.header ?? "";
      this.currentDirPath = commandsSections.currentDirPath ?? "";

      this.startCommand = commandsSections.startCommand;
      this.saveFunction = commandsSections.saveFunction ??
         (() => saveCommandsFile(this.GetDataToSave()));

      this.sections = {};
      if (!!commandsSections.sections) for (const section in commandsSections.sections)
         this.sections[section] = new CommandsSections(({
            ...commandsSections.sections[section],
            currentDirPath: this.currentDirPath,
            saveFunction: this.saveFunction,
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
         const input = readlineSync.question(` ${this.currentDirPath} : `);

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


   private CreateSection(): boolean {
      const newSectionName = readlineSync.question(" New section name : ");
      const sectionExists = !!this.sections[newSectionName];

      if (sectionExists) {
         console.log(" Can not create section (name is reserved) \n");
         return false;
      } else {
         this.sections[newSectionName] = new CommandsSections({
            name: newSectionName,
            deep: this.deep + 1,
            currentDirPath: this.currentDirPath,
            startCommand: this.startCommand,
            saveFunction: this.saveFunction
         });
         this.saveFunction!();

         return true;
      }
   }

   private DeleteSection(): boolean {
      const sectionToDelete = readlineSync.question(" Section to delete : ");
      const sectionExists = !!this.sections[sectionToDelete];

      if (!sectionExists) {
         console.log(` No section with name ${sectionToDelete} \n`);
         return false;
      } else if (isReplyPositive(readlineSync.question(` Are you sure you want to delete ${sectionToDelete} section? \n [yes/no] : `))) {
         delete this.sections[sectionToDelete];
         this.saveFunction!();
         return true;
      }
      return false;
   }


   private CheckForCommandName(): boolean {
      return true;
   }

   private CreateCommand(): boolean {
      return false;
   }

   private DeleteCommand(): boolean {
      return false;
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
         const input = readlineSync.question(chalk.magenta(` ${"=".repeat(this.deep + 1)}> `));
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
         } else if (input === "cli-cc") {
            if (this.CreateCommand()) displaySection();
            continue;
         } else if (input === "cli-cs") {
            if (this.CreateSection()) displaySection();
            continue;
         } else if (input === "cli-dc") {
            if (this.DeleteCommand()) displaySection();
            continue;
         } else if (input === "cli-ds") {
            if (this.DeleteSection()) displaySection();
            continue;
         }

         if (input[0] === "-") this.SpawnCommand(input);
         else this.EnterSection(input, displaySection);
      }
   }


   public GetDataToSave(): commandsSections {
      const sectionsName = Object.keys(this.sections);
      const sectionsData: { [sectionName: string]: commandsSections } = {};
      sectionsName.forEach(sN => sectionsData[sN] = this.sections[sN].GetDataToSave());

      return {
         name: this.name,
         header: this.header,
         currentDirPath: this.deep === 1 ? this.currentDirPath : undefined,
         sections: sectionsData,
         commands: {},
      }
   }
}
