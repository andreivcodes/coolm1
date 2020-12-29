const { menubar } = require("menubar");

var { ipcMain } = require("electron");
const { autoUpdater } = require("electron-updater");
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);
const Store = require("electron-store");
const AutoLaunch = require("auto-launch");
let path = require("path");
let { rootPath } = require("electron-root-path");
const root = rootPath;

let store = new Store();
//require("update-electron-app")();

var coolm1Launcher = new AutoLaunch({
  name: "coolm1",
  path: "/Applications/coolm1.app",
  isHidden: true,
});

const mb = menubar({
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    width: 600,
    height: 300,
    resizable: false,
    preloadWindow: true,
    show: false,
  },
});

ipcMain.on("autostart", (event, arg) => {
  if (arg) {
    coolm1Launcher.enable();
  } else {
    coolm1Launcher.disable();
  }
});

ipcMain.handle("getStoreValue", (event, key) => {
  return store.get(key);
});

ipcMain.handle("hasStoreValue", (event, key) => {
  return store.has(key);
});

mb.on("show", () => {
  mb.window.webContents.send("visibility", true);
});

mb.on("after-hide", () => {
  mb.window.webContents.send("visibility", false);
  mb.app.dock.hide();
});

autoUpdater.on("update-downloaded", () => {
  autoUpdater.quitAndInstall();
});

mb.on("ready", () => {
  autoUpdater.checkForUpdatesAndNotify();

  const { execPath } = require("./app/binaries");

  mb.app.dock.hide();

  ipcMain.on("index", (event, arg) => {
    switch (arg) {
      case "getNames":
        run_shell_command(execPath + " n").then((res) => {
          mb.window.webContents.send("names", res.stdout);
        });
        break;
      case "getValues":
        run_shell_command(execPath + " v").then((res) => {
          mb.window.webContents.send("values", res.stdout);
        });
        break;
      case "showalltoggle":
        if (mb.window.getSize()[1] == 800) mb.window.setSize(600, 300);
        else mb.window.setSize(600, 800);
        break;
      case "close":
        mb.app.exit(0);
        break;
    }
  });
});

async function run_shell_command(command) {
  let result;
  try {
    result = await execProm(command);
  } catch (ex) {
    result = ex;
  }
  if (Error[Symbol.hasInstance](result)) return;

  return result;
}
