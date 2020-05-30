export default function getYamlSetupFile(projectName: string): string {
   const defaultFileHeader = ' This files contains commands and their description. Editing is available by changing commands.js file. To enter section you need to print its name. To run command write: -<<commandName>>';
   const currentDirPath = process.cwd();

   const defaultFileObject: { [key: string]: any } = {
      name: !!projectName ? projectName : "myProject",
      header: `"${defaultFileHeader}"`,
      currentDirPath: currentDirPath
   };

   return Object.keys(defaultFileObject).reduce((p, c) => {
      return `${p}${c}: ${defaultFileObject[c]}\n`;
   }, "");
};
