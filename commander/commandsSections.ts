import CommandsGroup, {commandsGroup} from "./commandsGroup";
import readlineSync from "readline-sync";
import {execSync} from "child_process";
import chalk from "chalk";
import {isReplyPositive, saveCommandsFile} from "../commander";
import {command} from "./command";


export type commandsSections = {
   name: string;
   deep?: number;
   sections?: { [name: string]: commandsSections };
   commands?: { [name: string]: commandsGroup };
   header?: string;
   currentDirPath?: string;
   showHelp?: boolean;
   startCommand?: Function;
   saveFunction?: Function;
}

export default class CommandsSections {
   public readonly name: string;
   public readonly deep: number;

   public readonly sections: { [name: string]: CommandsSections };
   public readonly commands: { [name: string]: CommandsGroup };

   public readonly header?: string;
   public readonly currentDirPath: string;
   public showHelp?: boolean;

   public readonly startCommand?: Function;
   public readonly saveFunction?: Function;


   constructor(commandsSections: commandsSections) {
      this.name = commandsSections.name;
      this.deep = commandsSections.deep ?? 1;
      this.header = commandsSections.header ?? "";
      this.currentDirPath = commandsSections.currentDirPath ?? "";
      this.showHelp = commandsSections.showHelp ?? true;

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
         this.commands[command] = new CommandsGroup(({
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

   public ShowDefaultCommands(): void {
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "c",
         actionDescription: "clear"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "q",
         actionDescription: "quit section / app"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "s",
         actionDescription: "save file"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "h",
         actionDescription: "show/hide default commands"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "--",
         actionDescription: "run console command"
      });
      console.log();
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "cli-cs",
         actionDescription: "create commands section"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "cli-ds",
         actionDescription: "delete commands section"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "cli-cc",
         actionDescription: "create command in current section"
      });
      CommandsGroup.ShowCommand({
         deep: this.deep,
         name: "cli-dc",
         actionDescription: "delete command in current section"
      });
   }


   public Show(): void {
      console.log();
      if (!!this.header) console.log(this.header);

      console.log();
      if (!!this.currentDirPath) {
         console.log(` dir : ${this.currentDirPath}`);
         if (!!this.startCommand) console.log();
      }
      if (!!this.startCommand) this.startCommand();

      console.log();
      this.ShowTitle();

      if (this.showHelp) {
         console.log();
         this.ShowDefaultCommands();
         console.log(" I".padEnd(53, "-") + "|");
      }

      if (Object.keys(this.sections).length > 0) console.log();
      Object.keys(this.sections).forEach(s => this.sections[s].ShowSectionTitle());

      if (Object.keys(this.commands).length > 0) console.log();
      Object.keys(this.commands).forEach(c => this.commands[c].Show());

      console.log();
   }

   public SpawnCommand(commandName: string): void {
      const command = this.commands[commandName];
      if (!command) return console.error(" No such command");
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
         return true;
      }
      return false;
   }

   private CreateCommand(): boolean {
      const newCommandName = readlineSync.question(" New command name : ");
      const commandExists = !!this.sections[newCommandName];

      if (commandExists) {
         console.log(" Can not create command (name is reserved) \n");
         return false;
      } else {
         const commandDescription = readlineSync.question(" CommandDescription : ");
         let commandsCount: undefined | number | string = readlineSync.question(" Commands count (default - 1) : ");
         if (+commandsCount > 0) commandsCount = +commandsCount;
         else commandsCount = 1;

         const commands: Array<command> = [];
         for (let i = 0; i < commandsCount; i++) {
            console.log(` Command ${i + 1} : \n`);
            const cmd = readlineSync.question(" Command name (for example 'git' not 'git commit') : ");
            const cmdParams = readlineSync.question(" Command params (for example 'commit') : ");
            const cmdConfigurableValues = readlineSync.question(" Command configurable values : ").split(" ");
            const ignoreLogs = isReplyPositive(readlineSync.question(" Ignore logs [yes/no] : "));

            commands.push({
               cmd,
               cmdParams: !!cmdParams ? cmdParams : undefined,
               cmdConfigurableValues: cmdConfigurableValues.some(s => !!s) ? cmdConfigurableValues : undefined,
               ignoreLogs: ignoreLogs ? ignoreLogs : undefined,
            });
         }

         this.commands["-" + newCommandName] = new CommandsGroup({
            name: newCommandName,
            actionDescription: commandDescription ?? undefined,
            cmd: commands,
            deep: this.deep + 1
         });
         return true;
      }
   }

   private DeleteCommand(): boolean {
      const commandToDelete = readlineSync.question(" Command to delete : ");
      const commandExists = !!this.commands[commandToDelete];

      if (!commandExists) {
         console.log(` No command with name ${commandToDelete} \n`);
         return false;
      } else if (isReplyPositive(readlineSync.question(` Are you sure you want to delete ${commandToDelete} command? \n [yes/no] : `))) {
         delete this.commands[commandToDelete];
         return true;
      }
      return false;
   }


   public Enter(onSectionQuit: any): void {
      const displaySection = () => {
         console.clear();
         this.Show();
      };

      displaySection();
      while (true) {
         const input = readlineSync.question(chalk.magenta(` ${"=".repeat(this.deep)}> `));
         if (!input) continue;

         if (input === "q") {
            onSectionQuit();
            break;
         } else if (input === "c") {
            displaySection();
            continue;
         } else if (input === "s") {
            this.saveFunction!();
            displaySection();
            continue;
         } else if (input === "h" && this.deep === 1) {
            this.showHelp = !this.showHelp;
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

      const commandsName = Object.keys(this.commands);
      const commandsData: { [sectionName: string]: commandsGroup } = {};
      commandsName.forEach(sN => commandsData[sN] = this.commands[sN].GetDataToSave());


      return {
         name: this.name,
         header: this.header,
         currentDirPath: this.deep === 1 ? this.currentDirPath : undefined,
         showHelp: this.showHelp,
         sections: sectionsData,
         commands: commandsData,
      }
   }
}
