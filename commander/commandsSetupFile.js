"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getYamlSetupFile(projectName) {
    const defaultFileHeader = ' This files contains commands and their description. Editing is available by changing commands.js file. To enter section you need to print its name. To run command write: -<<commandName>>';
    const currentDirPath = process.cwd();
    const defaultFileObject = {
        name: !!projectName ? projectName : "myProject",
        header: `"${defaultFileHeader}"`,
        currentDirPath: currentDirPath
    };
    return Object.keys(defaultFileObject).reduce((p, c) => {
        return `${p}${c}: ${defaultFileObject[c]}\n`;
    }, "");
}
exports.default = getYamlSetupFile;
;
