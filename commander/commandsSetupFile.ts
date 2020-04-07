const fileData = (projectName: string) => `module.exports = {
   name: "${!!projectName ? projectName : "myProject"}",
   header: " This files contains commands and their description. \\n Editing is available by changing commands.js file. \\n To enter section you need to print its name. \\n To run command write: -<<commandName>>",
   currentDirPath: process.cwd()
};`;

export default fileData;
