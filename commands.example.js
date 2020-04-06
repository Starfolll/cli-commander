module.exports = {
   name: "commands example",
   header: process.env.BUILD_MODE === "dev" ? "DEV" : "PROD",
   currentDirPath: process.cwd(),
   commands: {
      "-br": {
         name: "br",
         actionDescription: "-",
         cmd: [
            {cmd: "prisma", cmdParams: ["deploy"]},
            {cmd: "tsc"},
            {cmd: "pm2", cmdParams: ["restart", "ecosystem.config.js"]},
         ]
      },
      "-up": {
         name: "up",
         actionDescription: "-",
         cmd: [{cmd: "pm2", cmdParams: ["restart", "ecosystem.config.js"]}]
      }
   },
   sections: {
      "tsc": {
         name: "tsc",
         commands: {
            "-build": {
               name: "build",
               actionDescription: "build .ts files",
               cmd: [{
                  cmd: "tsc"
               }]
            }
         },
      },
      "prisma": {
         name: "prisma",
         commands: {
            "-deploy": {
               name: "deploy",
               cmd: [{
                  cmd: "prisma",
                  cmdParams: ["deploy"]
               }]
            }
         }
      },
      "docker-compose": {
         name: "docker-compose",
         commands: {
            "-up": {
               name: "up",
               actionDescription: "docker-compose up",
               cmd: [{
                  cmd: "sudo",
                  cmdParams: "docker-compose up".split(" ")
               }]
            },
            "-down": {
               name: "down",
               actionDescription: "docker-compose down",
               cmd: [{
                  cmd: "sudo",
                  cmdParams: "docker-compose down".split(" ")
               }]
            }
         }
      },
   }
};
