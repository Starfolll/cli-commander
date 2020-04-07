"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileData = (projectName) => `module.exports = {
   name: "${!!projectName ? projectName : "myProject"}",
   header: " This files contains commands and their description. \\n Editing is available by changing commands.js file. \\n To enter section you need to print its name. \\n To run command write: -<<commandName>>",
   currentDirPath: process.cwd()
};`;
exports.default = fileData;
