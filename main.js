const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const runShellCommand = require("./utils/runShellCommand");
const runCommandAdmin = require("./utils/runCommandAdmin");
const openFolder = require("./utils/openFolder");
const popUpProgressBar = require("./utils/popUpProgressBar");
const showNotification = require('./utils/showNotification');
const openBrowser = require('./utils/openBrowser');
const setAWSCredentialsEnv = require("./accessories/setAWSCredentialsEnv");
const { exec } = require("child_process");
const showGenericDialog = require('./utils/showGenericDialog');
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 700,
    height: 600,
    title: "App Link",
    center: true,
    icon: "./img/AppLogo.png",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    resizable: false,
  });

  const menuBarApp = [
    {
      label: "Git",
      submenu: [
        {
          label: "Open Git Repositories .. ( Browser ) ",
          click: () => openBrowser("https://github.com/nice-cxone"),
        },
      ],
    },
    {
      label: "Credentials",
      submenu: [
        {
          label: "Run Credentials script .. ( PS ) ",
          click: () => {

            const folderLocation = "C:/Intel/Conf/aws-role-creds-V2.0-updated.ps1";
            exec(`start powershell.exe -NoExit -File "${folderLocation}"`, (error, stdout, stderr) => {
              if (error) {
                console.error(`Error executing PS script: ${error}`);
                return;
              }
              console.log(`STDOUT: ${stdout}`);
              console.error(`STDERR: ${stderr}`);
            });
          },
        },
        {
          label: "Update Aws Credentials .. ( Env ) ",
          click: (() => {
            setAWSCredentialsEnv()
            setTimeout(() => {
              showNotification('Dune !', 'Successfully Updated AWS Credentials On Env !');
            }, 5000);
          })
        },
        {
          label: "Delete Aws Credentials  .. ( Env ) ",
          click: (() => {
            setAWSCredentialsEnv(true);
            setTimeout(() => {
              showNotification('SUCCESS !', 'Successfully Deleted AWS Credentials From Env !');
            }, 5000);
          })
        },
      ],
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Open Terminal - Work Space .. ",
          click: () => {

            const command = "cmd /k echo Type A Command and press Enter to Run it ..."
            runShellCommand(undefined, command)
          }
        },
        {
          label: "Open Program and Software ..",
          click: () => {

            popUpProgressBar(3, `Open Program & Software !`, true);
            runShellCommand(undefined, "control.exe appwiz.cpl", true)
          }
        },
        {
          label: "Open Environment Variables .. ",
          click: async () => {
            const openEnv = "rundll32 sysdm.cpl,EditEnvironmentVariables";
            await runCommandAdmin(openEnv);
          },
        },
        {
          label: "Open User Folder - Explorer ..",
          click: (() => {
            const os = require('os');
            const userHome = os.homedir();
            popUpProgressBar(3, `Opening Your folder !`, true);
            openFolder(userHome);
          }),
        },
      ],
    },
    {
      label: "Application",
      submenu: [
        {
          label: "Console ..",
          click: () => {
            mainWindow.webContents.openDevTools();
          },
        },
        {
          label: "Refresh ..",
          click: () => {
            mainWindow.reload();
          },
        },
        {
          label: "About ..",
          click: () => {
            mainWindow.loadFile("./html/aboutThisApp.html");
          },
        },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(menuBarApp);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.loadFile("./html/indexPage.html");

  // mainWindow.webContents.openDevTools();

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}


app.on("ready", ev => {
  createWindow();
  if (process.platform == 'win32') {
    app.setAppUserModelId('App Link App');
  }
})

ipcMain.on('navigate-to-main', () => {
  mainWindow.loadFile('./html/indexPage.html');
});

ipcMain.on('show-generic-dialog', () => {
  showGenericDialog()
});

ipcMain.on('pop-up-progress-bar', (event, time, message) => {
  console.log(event);
  popUpProgressBar(time, message);
});










// openFileDialog("jar");


// const disableAllMenuItems = () => {
//   for (const item of mainMenu.items) {
//     if (item.submenu) {
//       for (const subItem of item.submenu.items) {
//         subItem.enabled = false;
//       }
//     } else {
//       item.enabled = false;
//     }
//   }
// }

// const enableAllMenuItems = () => {
//   for (const item of mainMenu.items) {
//     if (item.submenu) {
//       for (const subItem of item.submenu.items) {
//         subItem.enabled = true;
//       }
//     } else {
//       item.enabled = true;
//     }
//   }
// }




