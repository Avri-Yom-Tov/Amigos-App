const { app, BrowserWindow, ipcMain, Menu } = require("electron");
const runShellCommand = require("./utils/runShellCommand");
const openFolder = require("./utils/openFolder");
const popUpProgressBar = require("./utils/popUpProgressBar");
const showNotification = require('./utils/showNotification');
const getFilterRepositories = require("./accessories/getFilterRepositories");
const { exec } = require("child_process");

let mainWindow;

function createWindow() {
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
          label: "Open Git Repository ( Browser ) ",
          click: () => {
            mainWindow.loadFile("./html/openGitRepoBrowser.html");
          },
        },
        {
          label: "Clone New Repository ( Master )",
          click: () => {
            mainWindow.loadFile("./html/cloneRepository.html");
          },
        },
        {
          label: "Update Repository file ( Locally )",
          click: async () => {
            try {
              await getFilterRepositories();
              showNotification('SUCCESS !', 'Successfully Updated Repositories !');
            } catch (error) {
              console.error(error);
              showNotification('ERROR !', `Failed to Update Repositories : ${error.message}`);
            }
          }
        }
      ],
    },
    {
      label: "Credentials",
      submenu: [
        {
          label: "Run Credentials script ( PS ) ",
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
      ],
    },
    {
      label: "Developer",
      submenu: [
        {
          label: "Open User Folder ..  ( Systems ) ",
          click: (() => {
            const os = require('os');
            const userHome = os.homedir();
            popUpProgressBar(2, `Opening folder !`, true);
            openFolder(userHome)
          }),

        },
        {
          label: "Open Programs ..  ( Control Panel )",
          click: () => runShellCommand("control.exe appwiz.cpl", true)
        },
      ],
    },
    {
      label: "Application",
      submenu: [
        {
          label: "About ..",
          click: () => {
            mainWindow.loadFile("./html/aboutThisApp.html");
          },
        },
        {
          label: "Refresh ..",
          click: () => {
            mainWindow.reload();
          },
        },
        {
          label: "Console ..",
          click: () => {
            mainWindow.webContents.openDevTools();
          },
        },
      ],
    },
  ];

  const mainMenu = Menu.buildFromTemplate(menuBarApp);
  Menu.setApplicationMenu(mainMenu);
  mainWindow.loadFile("./html/indexPage.html");

  mainWindow.webContents.openDevTools();

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














function disableAllMenuItems() {
  for (const item of mainMenu.items) {
    if (item.submenu) {
      for (const subItem of item.submenu.items) {
        subItem.enabled = false;
      }
    } else {
      item.enabled = false;
    }
  }
}

// Function to enable all menu items
function enableAllMenuItems() {
  for (const item of mainMenu.items) {
    if (item.submenu) {
      for (const subItem of item.submenu.items) {
        subItem.enabled = true;
      }
    } else {
      item.enabled = true;
    }
  }
}




