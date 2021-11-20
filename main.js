const { menubar } = require("menubar");

var { ipcMain } = require("electron");
const util = require("util");
const { exec } = require("child_process");
const execProm = util.promisify(exec);
const Store = require("electron-store");
const AutoLaunch = require("auto-launch");

let store = new Store();

require("update-electron-app")();

var coolm1Launcher = new AutoLaunch({
  name: "coolm1",
  path: "/Applications/coolm11.app",
  isHidden: true,
});

const mb = menubar({
  browserWindow: {
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
    width: 600,
    height: 350,
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

let showtemp = false;
ipcMain.on("showtemp", (event, arg) => {
  if (arg) {
    showtemp = true;
  } else {
    showtemp = false;
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

let firstShow = true;
let hidden = true;
mb.on("ready", () => {
  const { execPath } = require("./app/binaries");

  //show for a bit so we load sensors
  mb.showWindow();

  showtemp = store.get("showtemp");
  ipcMain.on("settemp", (event, args) => {
    if (firstShow) {
      mb.hideWindow();
      firstShow = false;
    }
    if (showtemp) mb.tray.setTitle(args);
    else mb.tray.setTitle("");
  });

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
        if (hidden) mb.window.setSize(600, 780);
        else mb.window.setSize(600, 350);
        hidden = !hidden;
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
