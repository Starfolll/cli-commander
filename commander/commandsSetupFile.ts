const fileData = (projectName: string) => `module.exports = {
   name: "${!!projectName ? projectName : "myProject"}",
   header: "header",
   currentDirPath: process.cwd()
};`;

export default fileData;
