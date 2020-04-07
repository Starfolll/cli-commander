"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fileData = (projectName) => `module.exports = {
   name: "${!!projectName ? projectName : "myProject"}",
   header: "header",
   currentDirPath: process.cwd()
};`;
exports.default = fileData;
